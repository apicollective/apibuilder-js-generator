import { generateOpenApiSpec } from '../../../../../src/generators/openapi/generators/openapi-spec';

test.only('should pass something', () => {
  expect(typeof generateOpenApiSpec).toBe('function');
});
