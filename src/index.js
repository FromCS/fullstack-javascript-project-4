import axios from 'axios';
import * as fs from 'fs/promises';
import path from 'path';
import getValidFilename from './getValidFilename.js';
import loadImages from './loadImages.js';

const pageLoader = (url, output = process.cwd()) => {
  const loadingURL = new URL(url);
  const loadingFilename = getValidFilename(loadingURL);
  const loadingFilepath = path.join(output, loadingFilename);
  const html = axios.get(loadingURL)
    .then(({ data }) => {
      fs.writeFile(loadingFilepath, data);
      return data;
    });

  const imagePromises = html
    .then((data) => loadImages(loadingURL, data, output, loadingFilepath));
  return imagePromises;
};

export default pageLoader;
