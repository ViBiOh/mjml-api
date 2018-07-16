const opentracing = require('express-opentracing');
const jaeger = require('jaeger-client');
const bunyan = require('bunyan');

console.log('[opentracing] Initializing jaeger');

module.exports = function(app, options) {
  const tracer = jaeger.initTracer({
    serviceName: options.tracingName,
    sampler: {
      type: 'const',
      param: 1,
    },
    reporter: {
      logSpans: false,
      flushIntervalMs: 1000,
      agentHost: options.jaegerHost || 'jaeger',
      agentPort: options.jaegerPort || 6831,
    },
  }, {
    logger: bunyan.createLogger({ name: 'tracing' }),
  });

  app.use(opentracing.default({ tracer: tracer }));
}
