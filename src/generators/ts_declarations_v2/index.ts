import {
  ApiBuilderFile,
  ApiBuilderInvocationFormConfig,
  ApiBuilderService,
} from 'apibuilder-js';

import {
  builders as b,
  namedTypes,
} from 'ast-types';

import { print } from 'recast';

import {
  buildContext,
  buildModuleDeclarationsFromService,
  Context,
} from '../../builders';
import getTags from '../../utilities/getTags';

function buildFile(
  service: ApiBuilderService,
  context: Context,
): namedTypes.File {
  return b.file.from({
    program: b.program.from({
      body: buildModuleDeclarationsFromService(service, context),
    }),
  });
}

export function generate(
  invocationForm: ApiBuilderInvocationFormConfig,
): Promise<ApiBuilderFile[]> {
  return new Promise((resolve) => {
    const allowTags = invocationForm.attributes.reduce<string[]>((_, attribute) => {
      if (attribute.name === 'allow_tags')
        _.push(...attribute.value.split(','));
      return _;
    }, []);

    const context = buildContext(invocationForm, {
      isTypeAllowed(type) {
        if (!allowTags.length) return true;
        const tags = getTags(type);
        return allowTags.some((_) => tags.includes(_));
      }
    });

    // Create a declaration file for each service to avoid duplicate
    // declaration errors when generating multiple services that depend
    // on the same imported services.
    const files = context.importedServices
      .concat(context.rootService)
      .reduce<ApiBuilderFile[]>((_, service) => {
        const file = buildFile(service, context);
        const basename = `${service.namespace}.${service.applicationKey}.d.ts`;
        const dirname = '';
        const { code } = print(file, {
          quote: 'single',
          tabWidth: 2,
          trailingComma: true,
          useTabs: false,
        });
        if (code.length) _.push(new ApiBuilderFile(basename, dirname, code));
        return _;
      }, []);

    resolve(files);
  });
}
