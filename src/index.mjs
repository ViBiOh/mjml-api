#!/usr/bin/env node

import './telemetry.mjs';
import cluster from 'cluster';
import express from 'express';
import helmet from 'helmet';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import app from './app.mjs';
import server from './server.mjs';

const options = yargs(hideBin(process.argv))
  .env('MJML')
  .options('workerCount', {
    required: false,
    type: 'number',
    describe: 'Worker count for cluster mode',
    default: 1,
  })
  .options('listenDuration', {
    required: false,
    type: 'number',
    describe:
      'Number of seconds during the server is started before shutting down.',
    default: 0,
  })
  .options('listenPort', {
    required: true,
    type: 'number',
    describe: 'Listening port',
    default: 3000,
  })
  .options('listenHost', {
    required: false,
    type: 'string',
    describe: 'Listening host',
    default: '',
  })
  .check((argv) => {
    for (const name of ['workerCount', 'listenDuration', 'listenPort']) {
      if (!Number.isInteger(argv[name]) || argv[name] < 0) {
        throw new Error(`${name} must be a non-negative integer`);
      }
    }

    if (argv.listenPort > 65535) {
      throw new Error('listenPort must be lower than 65536');
    }

    return true;
  })
  .help('help').argv;

if (cluster.isPrimary && options.workerCount > 1) {
  server.initPrimary(options);
} else {
  const expressApp = express();

  expressApp.use(helmet());

  app.init(expressApp);
  server.init(expressApp, options);
}
