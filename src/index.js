#!/usr/bin/env node

import cluster from 'cluster';
import express from 'express';
import yargs from 'yargs';
import server from './server';
import app from './app';

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
    default: 2,
  });

  return args.help('help').strict().argv;
}

const options = getOptions();
const expressApp = express();

if (cluster.isPrimary) {
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
