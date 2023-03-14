/* eslint-disable no-template-curly-in-string */
import { getEndpointUriStr } from '../../../../../src/generators/js_isomorphic/codegen/util/service';

describe('getEndpointUriStr', () => {
  test('should get expected basic endpoint', () => {
    const result = getEndpointUriStr({
      path: '/this/is/the/path',
    });
    expect(result).toEqual('/this/is/the/path');
  });

  test('should substitute path parameters correctly', () => {
    const result = getEndpointUriStr({
      path: '/this/is/:variable1/the/:path',
    });
    expect(result).toEqual('/this/is/${variable1}/the/${path}');
  });

  test('should convert path parameters to camelCase', () => {
    const result = getEndpointUriStr({
      path: '/:dannyDeVito/is/:pretty_small',
    });
    expect(result).toEqual('/${dannyDeVito}/is/${prettySmall}');
  });

  test('should maintain url suffix if last url part has parameter', () => {
    const result = getEndpointUriStr({
      path: '/:dannyDeVito/is/:pretty_small.csv',
    });
    expect(result).toEqual('/${dannyDeVito}/is/${prettySmall}.csv');
  });

  test('should maintain url suffix with extra periods', () => {
    const result = getEndpointUriStr({
      path: '/:dannyDeVito/is/:pretty_small.tar.gz',
    });
    expect(result).toEqual('/${dannyDeVito}/is/${prettySmall}.tar.gz');
  });
});
