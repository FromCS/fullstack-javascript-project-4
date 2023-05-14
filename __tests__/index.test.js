import os from 'os';
import { fileURLToPath } from 'url';
import * as fs from 'fs/promises';
import path, { dirname } from 'path';
import nock from 'nock';
import pageLoader from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = async (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

nock.disableNetConnect();

let fixtureHTML;
let tempDir;
let scope;

beforeAll (async () => {
  fixtureHTML = await readFile('example.html');
});

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  scope = nock(/ru\.hexlet\.io/)
    .get(/\/courses/)
    .reply(200, fixtureHTML);
  await pageLoader('https://ru.hexlet.io/courses', tempDir);
});

test('HTTP query', async () => {
  expect(scope.isDone()).toBe(true);
});

test('creating file with right name', async () => {
  const expectedName = 'ru-hexlet-io-courses.html';
  const expectedPath = path.join(tempDir, expectedName);
  await expect(fs.readFile(expectedPath, 'utf-8')).resolves.toBe(fixtureHTML);
});
