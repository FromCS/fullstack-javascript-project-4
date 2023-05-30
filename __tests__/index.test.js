import os from 'os';
import { fileURLToPath } from 'url';
import * as fs from 'fs/promises';
import path, { dirname } from 'path';
import nock from 'nock';
import * as cheerio from 'cheerio';
import { createReadStream } from 'fs';
import pageLoader from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = async (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

nock.disableNetConnect();

let fixtureHTML;
let tempDir;
let tempDirFiles;
let scope;
let expectedHTMLName;
let expectedHTMLPath;
let expectedImageName;
let imagesScope;
let html;

beforeAll (async () => {
  fixtureHTML = await readFile('example.html');
  expectedHTMLName = 'ru-hexlet-io-courses.html';
  expectedImageName = 'ru-hexlet-io-assets-professions-nodejs.png';
});

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  expectedHTMLPath = path.join(tempDir, expectedHTMLName);
  scope = nock(/ru\.hexlet\.io/)
    .get(/\/courses/)
    .reply(200, fixtureHTML);
  imagesScope = nock(/.*/)
    .get(/assets\/professions\/nodejs\.png/)
    .reply(200, (uri, responseBody) => createReadStream(path.join(__dirname, '..', '__fixtures__', 'assets', 'professions', 'nodejs.png')));
  await pageLoader('https://ru.hexlet.io/courses', tempDir);
  html = await fs.readFile(expectedHTMLPath, 'utf-8');
  tempDirFiles = await fs.readdir(tempDir);
});

test('HTTP query', async () => {
  expect(scope.isDone()).toBe(true);
});

test('creating file with right name', async () => {
  expect(tempDirFiles.includes('ru-hexlet-io-courses.html')).toBe(true);
});

test('loading images from HTML', async () => {
  expect(imagesScope.isDone()).toBe(true);
  expect(tempDirFiles.includes('ru-hexlet-io-courses_files')).toBe(true);
  const receivedImages = await fs.readdir(path.join(tempDir, 'ru-hexlet-io-courses_files'));
  expect(receivedImages).toEqual([expectedImageName]);
  const $ = cheerio.load(html);
  const receivedImageSrc = $('img[src]').attr('src');
  expect(receivedImageSrc).toBe(`ru-hexlet-io-courses_files/${expectedImageName}`);
});
