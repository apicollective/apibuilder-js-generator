import ensurePath from '../ensure-path';

describe('utilities > ensurePath', () => {
  // This test is here to touch the code in case anyone changes the signature
  // Not intended to mess with the filesystem for testing purposes.
  it('should make sure a directory exists', () => {
    const directory = __dirname;
    return ensurePath(directory);
  });
});
