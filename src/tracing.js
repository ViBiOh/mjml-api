import middleware from'express-opentracing';
import initTracer from 'jaeger-client';

/**
 * Args definition for tracing
 * @param  {Object} yargs Yargs object
 * @return {Object}       Yargs object
 */
function args(yargs) {
  return yargs
    .options('tracingName', {
      required: false,
      type: 'String',
      describe: 'Opentracing Service Name',
    })
    .options('jaegerHost', {
      required: false,
      type: 'String',
      describe: 'Jaeger Remote Host',
      default: 'jaeger',
    })
    .options('jaegerPort', {
      required: false,
      type: 'Number',
      describe: 'Jaeger Remote Port',
      default: 6832,
    });
}

/**
 * Init opentracing with Jaeger client
 * @param  {Object} app          Express App
 * @param  {Object} options      Yargs options
 * @param  {Array}  excludePaths Exluded paths in tracing
 */
function init(app, options, excludePaths = []) {
  if (!options.tracingName) {
    return;
  }

  const tracer = initTracer({
    serviceName: options.tracingName,
    sampler: {
      type: 'const',
      param: 1,
    },
    reporter: {
      logSpans: false,
      agentHost: options.jaegerHost,
      agentPort: options.jaegerPort,
    },
  }, {
    logger: {
      info: msg => console.info(msg),
      error: msg => console.error(msg),
    },
  });

  app.use((req, res, next) => {
    if (excludePaths.filter(e => req.path.startsWith(e)).length) {
      return next();
    }

    middleware({ tracer: tracer })(req, res, next);
  });
}

export default {
  init,
  args,
}
