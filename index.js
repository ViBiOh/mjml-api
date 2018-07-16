#!/usr/bin/env node

const app = require('express')();
const bodyParser = require('body-parser');
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
    type: 'Number',
    describe: 'Jaeger Remote Port',
  })
  .help('help')
  .strict().argv;

app.use(bodyParser.json());
if (options.tracingName) {
  require('./src/tracing.js')(app, options, ['/health'])
}

app.get('/health', function (req, res) {
  res.sendStatus(200);
});

app.post('/', function (req, res) {
  res.send(mjml2html(req.body.mjml))
});

app.listen(3000, () => console.log('Listening on port 3000'));
