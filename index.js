#!/usr/bin/env node

const app = require('express')();
const bodyParser = require('body-parser');
const opentracing = require('express-opentracing');
const jaeger = require('jaeger-client');
const mjml2html = require('mjml');

const options = require('yargs')
  .reset()
  .options('tracingName', {
    required: false,
    type: 'String',
    describe: 'Opentracing Service Name',
  })
  .options('jaegerHost', {
    required: false,
    type: 'String',
    describe: 'Jaeger Remote Host',
  })
  .options('jaegerPort', {
    required: false,
    type: 'String',
    describe: 'Jaeger Remote Port',
  })
  .help('help')
  .strict().argv;

console.dir(options);

if (options.tracingName) {
  console.log('[opentracing] Initializing jaeger');

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
      agentPort: options.jaegerPort || '6831',
    }
  });

  app.use((req, res, next) => {
    if (req.path.startsWith('/health')) {
      return next()
    }

    opentracing.default({ tracer })(req, res, next);
  });
}

app.use(bodyParser.json());

app.get('/health', function (req, res) {
  res.sendStatus(200);
});

app.post('/', function (req, res) {
  const output = mjml2html(req.body.mjml);

  res.send(output)
});

app.listen(3000, () => console.log('Listening on port 3000'));
