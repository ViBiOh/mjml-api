#!/usr/bin/env node

import express from 'express';
import yargs from 'yargs';
import server from './server';
import app from './app';

/**
 * Get options from yargs.
 * @return {Object} Yargs options
 */
function getOptions() {
  let args = yargs.reset();
  args = server.args(args);

  return args.help('help').strict().argv;
}

const options = getOptions();
const expressApp = express();

app.init(expressApp);
server.init(expressApp, options);
