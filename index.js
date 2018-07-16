#!/usr/bin/env node

const app = require('express')();
const bodyParser = require('body-parser');
const mjml2html = require('mjml');

app.use(bodyParser.json());

app.post('/', function (req, res) {
  const output = mjml2html(req.body.mjml);

  res.send(output)
});

app.listen(3000, () => console.log('Listening on port 3000'));
