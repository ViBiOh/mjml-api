import telemetry from './telemetry.mjs';

/**
 * Args definition
 * @param  {Object} yargs Yargs object
 * @return {Object}       Yargs object
 */
function args(yargs) {
  return yargs.options('port', {
    required: false,
    type: 'Number',
    describe: 'Listening port',
    default: 3000,
  });
}

/**
 * Init server.
 * @param  {Object} app     Express App
 * @param  {Object} options Yargs options
 */
function init(app, options) {
  const server = app.listen(options.port, () => {
    telemetry.logger.info(`Starting HTTP server on port ${options.port}`);
  });

  if (options.listenDuration !== 0) {
    telemetry.logger.info(
      `HTTP server will stop in ${options.listenDuration}s`,
    );

    setTimeout(() => server.close(() => {}), options.listenDuration * 1000);
  }
}

export default {
  init,
  args,
};
