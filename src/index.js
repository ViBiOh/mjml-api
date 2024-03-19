#!/usr/bin/env node

import cluster from 'cluster';
import express from 'express';
import helmet from 'helmet';
import yargs from 'yargs';
import app from './app';
import server from './server';

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
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.init(expressApp);
  server.init(expressApp, options);
}
