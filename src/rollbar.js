import Rollbar from 'rollbar';

/**
 * Args definition for tracing
 * @param  {Object} yargs Yargs object
 * @return {Object}       Yargs object
 */
function args(yargs) {
  return yargs
    .options('rollbarToken', {
      required: false,
      type: 'String',
      describe: 'Rollbar Token',
    })
    .options('rollbarEnv', {
      required: false,
      type: 'String',
      describe: 'Rollbar Environment',
    });
}

/**
 * Init opentracing with Jaeger client
 * @param  {Object} app          Express App
 * @param  {Object} options      Yargs options
 * @param  {Array}  excludePaths Exluded paths in tracing
 */
function init(app, options) {
  if (!options.rollbarToken) {
    return;
  }

  const rollbar = new Rollbar({
    accessToken: options.rollbarToken,
    environment: options.rollbarEnv,
  });
  rollbar.info(`${options.rollbarEnv} started`);

  app.use((err, req, res, next) => {
    rollbar.error(err);
    next(err);
  });
}

export default {
  init,
  args,
};
