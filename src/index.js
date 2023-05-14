import axios from 'axios';
import * as fs from 'fs/promises';
import path from 'path';
import getValidFilename from './getValidFilename.js';

const pageLoader = (url, output = process.cwd()) => {
  const [, hostname] = url.split('//');
  const filename = getValidFilename(hostname);
  return axios.get(url)
    .then(({ data }) => fs.writeFile(path.join(output, filename), data))
    .catch(console.error);
};

export default pageLoader;
