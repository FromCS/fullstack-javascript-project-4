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
      const { host, pathname } = new URL(attribs.src, url);
      const imageFilename = getValidFilename(`${host}${pathname}`, 'image');
      const localSrc = path.join(dirPath, imageFilename);
      $(`img[src=${pathname}]`).attr('src', localSrc);
      return `${host}${pathname}`;
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
