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
  app.listen(options.port, () =>
    console.log(`Starting HTTP server on port ${options.port}`),
  );
}

export default {
  init,
  args,
};
