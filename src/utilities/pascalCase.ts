import { camelCase, upperFirst } from 'lodash';

export default function pascalCase(
  value: string,
): string {
  return upperFirst(camelCase(value));
}
