import yargs from 'yargs';
import _ from 'lodash';
import { runCommand } from './common.js';

const { argv } = yargs(Deno.args).demandOption(['day']).option('watch', { type: 'boolean', default: false });

await runCommand(
  _.compact([
    'deno',
    'run',
    '--allow-read',
    '--import-map=import_map.json',
    argv.watch ? '--watch' : null,
    `src/days/${argv.day}/index.ts`,
  ]),
);
