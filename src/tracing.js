const opentracing = require('express-opentracing');
const jaeger = require('jaeger-client');

console.log('[opentracing] Initializing jaeger');

module.exports = function(app, options, excludePaths = []) {
  const tracer = jaeger.initTracer({
    serviceName: options.tracingName,
    sampler: {
      type: 'const',
      param: 1,
    },
    reporter: {
      logSpans: false,
      agentHost: 'jaeger',
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

    opentracing.default({ tracer: tracer })(req, res, next);
  });
}
