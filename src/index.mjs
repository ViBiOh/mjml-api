#!/usr/bin/env node

import cluster from 'cluster';
import express from 'express';
import helmet from 'helmet';
import rawYargs from 'yargs';
import telemetry from './telemetry.mjs';
import app from './app.mjs';
import server from './server.mjs';

const yargs = rawYargs();

/**
 * Get options from yargs.
 * @return {Object} Yargs options
 */
function getOptions() {
  const args = server.args(yargs);

  args.options('workerCount', {
    required: false,
    type: 'Number',
    describe: 'Worker count for cluster mode',
    default: 1,
  });

  return args.help('help').strict().argv;
}

const options = getOptions();
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
