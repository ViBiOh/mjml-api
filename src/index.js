#!/usr/bin/env node

import express from 'express';
import yargs from 'yargs';
import server from './server.js';
import app from './app.js';
import tracing from './tracing.js';

/**
 * Get options from yargs.
 * @return {Object} Yargs options
 */
function getOptions() {
  let args = yargs.reset();
  args = server.args(args);
  args = tracing.args(args);

  return args.help('help').strict().argv;
}

const options = getOptions();
const expressApp = express();

tracing.init(expressApp, options, ['/health']);
app.init(expressApp);
server.init(expressApp, options);
