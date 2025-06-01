#!/usr/bin/env node

import cluster from 'cluster';
import express from 'express';
import helmet from 'helmet';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import telemetry from './telemetry.mjs';
import app from './app.mjs';
import server from './server.mjs';

const options = yargs(hideBin(process.argv))
  .env('MJML')
  .options('workerCount', {
    required: false,
    type: 'Number',
    describe: 'Worker count for cluster mode',
    default: 1,
  })
  .options('listenDuration', {
    required: false,
    type: 'Number',
    describe:
      'Number of seconds during the server is started before shutting down.',
    default: 0,
  })
  .help('help')
  .strict().argv;

const expressApp = express();

expressApp.use(helmet());

if (cluster.isPrimary && options.workerCount > 1) {
  for (let i = 0; i < options.workerCount; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    telemetry.logger.info(`worker ${worker.process.pid} died`);
  });
} else {
  app.init(expressApp);
  server.init(expressApp, options);
}
