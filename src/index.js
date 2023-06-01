import axios from 'axios';
import * as fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import getValidFilename from './getValidFilename.js';
import loadImages from './loadImages.js';

const pageLoader = (url, output = process.cwd()) => {
  const loadingURL = new URL(url);
  const loadingFilename = getValidFilename(loadingURL);
  fs.access(output).then().catch(() => fs.mkdir(output));
  const loadingFilepath = path.resolve(process.cwd(), output, loadingFilename);
  const html = axios.get(loadingURL)
    .then(({ data }) => data);

  const promises = html
    .then((data) => {
      const $ = cheerio.load(data);
      const imagesPromises = loadImages(loadingURL, $, output);
      fs.writeFile(loadingFilepath, $.html());
      return imagesPromises;
    });
  return promises;
};

export default pageLoader;
