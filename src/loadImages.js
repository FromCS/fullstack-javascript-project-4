import axios from 'axios';
import * as fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import { createWriteStream } from 'fs';
import getValidFilename from './getValidFilename.js';

const getImagesLinks = (data, url, dirPath, loadPath) => {
  const $ = cheerio.load(data);
  const $imgs = $('img');
  const imageLinks = Array.from($imgs)
    .filter(({ attribs }) => attribs.src.endsWith('.png') || attribs.src.endsWith('.jpg'))
    .map(({ attribs }) => {
      const imageURL = new URL(attribs.src, url);
      const imageFilename = getValidFilename(imageURL, 'image');
      const localSrc = path.join(dirPath, imageFilename);
      $(`img[src=${imageURL.pathname}]`).attr('src', localSrc);
      return imageURL;
    });
  fs.writeFile(loadPath, $.html());
  return imageLinks;
};

export default (url, html, output, loadPath) => {
  const dirForFilesName = getValidFilename(url, 'dir');
  const dirForFilesPath = path.join(output, dirForFilesName);
  fs.mkdir(dirForFilesPath);
  const imagesLinks = getImagesLinks(html, url, dirForFilesName, loadPath);
  return Promise.all(imagesLinks.map((imageLink) => axios({
    method: 'get',
    url: imageLink,
    responseType: 'stream',
  })
    .then((response) => {
      response.data.pipe(createWriteStream(path.join(dirForFilesPath, getValidFilename(imageLink, 'image'))));
    }).catch(console.error)));
};
