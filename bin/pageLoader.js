#!/usr/bin/env node

import { Command } from 'commander';
import pageLoader from '../src/index.js';

const program = new Command();

program
  .description('Page loader utility')
  .version('1.0.0')
  .option('-o, --output [dir]', 'output dir (default: "/home/user/current-dir"')
  .argument('<url>', 'url of page for loading')
  .argument('[output]', 'output dir', process.cwd())
  .action((url, output) => {
    pageLoader(url, output).then(() => console.log(`Page was loaded to ${output}`));
  });

program.parse(process.argv);
