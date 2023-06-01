import axios from 'axios';
import * as fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import getValidFilename from './getValidFilename.js';

const getImagesLinks = ($, url, dirPath) => {
  const $imgs = $('img');
  const imageLinks = Array.from($imgs)
    .filter(({ attribs }) => attribs.src.endsWith('.png') || attribs.src.endsWith('.jpg'))
    .map(({ attribs }) => {
      const imageURL = new URL(attribs.src, url);
      const imageFilename = getValidFilename(imageURL, 'image');
      const localSrc = path.join(dirPath, imageFilename);
      // need to make another function for changing source of image?
      $(`img[src=${imageURL.pathname}]`).attr('src', localSrc);
      return imageURL;
    });
  return imageLinks;
};

export default (url, $, output) => {
  const dirForFilesName = getValidFilename(url, 'dir');
  const dirForFilesPath = path.join(output, dirForFilesName);
  fs.mkdir(dirForFilesPath);
  const imagesLinks = getImagesLinks($, url, dirForFilesName);
  return Promise.all(imagesLinks.map((imageLink) => axios({
    method: 'get',
    url: imageLink,
    responseType: 'stream',
  })
    .then((response) => {
      response.data.pipe(createWriteStream(path.join(dirForFilesPath, getValidFilename(imageLink, 'image'))));
      console.log(`Image was saved to ${dirForFilesPath}`);
    }).catch(console.error)));
};
