import telemetry from './telemetry.mjs';

/**
 * Init server.
 * @param  {Object} app     Express App
 * @param  {Object} options Yargs options
 */
function init(app, options) {
  const server = app.listen(options.listenPort, options.listenHost, () => {
    telemetry.logger.info(
      `Starting HTTP server on ${options.listenHost}:${options.listenPort}`,
    );
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
};
