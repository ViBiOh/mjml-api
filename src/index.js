#!/usr/bin/env node

import express from 'express';
import yargs from 'yargs';
import server from './server';
import app from './app';
import monitoring from './monitoring';
import tracing from './tracing';
import rollbar from './rollbar';

/**
 * Get options from yargs.
 * @return {Object} Yargs options
 */
function getOptions() {
  let args = yargs.reset();
  args = server.args(args);
  args = monitoring.args(args);
  args = tracing.args(args);
  args = rollbar.args(args);

  return args.help('help').strict().argv;
}

const options = getOptions();
const expressApp = express();

monitoring.init(expressApp, options);
tracing.init(expressApp, options, ['/health']);
rollbar.init(expressApp, options);
app.init(expressApp);
server.init(expressApp, options);
