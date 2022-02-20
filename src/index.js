#!/usr/bin/env node

// eslint-disable-next-line import/newline-after-import, import/order
import tracer from './tracer';
tracer('mjml');

/* eslint-disable import/first */
import cluster from 'cluster';
import express from 'express';
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
