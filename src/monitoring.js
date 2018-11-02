import Prometheus from 'prom-client';

/**
 * Args definition for tracing
 * @param  {Object} yargs Yargs object
 * @return {Object}       Yargs object
 */
function args(yargs) {
  return yargs.options('prometheusPath', {
    required: false,
    type: 'String',
    describe: 'Prometheus metrics path (blank to disable)',
    default: '/metrics',
  });
}

/**
 * Init opentracing with Jaeger client
 * @param  {Object} app          Express App
 * @param  {Object} options      Yargs options
 * @param  {Array}  excludePaths Exluded paths in tracing
 */
function init(app, options) {
  if (!options.prometheusPath) {
    return;
  }

  const { collectDefaultMetrics } = Prometheus;
  collectDefaultMetrics({ timeout: 5000 });

  // eslint-disable-next-line consistent-return
  app.get(options.prometheusPath, (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(Prometheus.register.metrics());
  });
}

export default {
  init,
  args,
};
