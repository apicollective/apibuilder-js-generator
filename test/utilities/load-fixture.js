import fs from 'fs';
import path from 'path';

export default function loadFixture(...paths) {
  return fs.readFileSync(path.join(...paths), { encoding: 'UTF-8' });
}
