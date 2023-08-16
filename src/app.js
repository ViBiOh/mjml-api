import mjml2html from 'mjml';
import { json } from 'body-parser';
import promBundle from 'express-prom-bundle';
import opentelemetry from '@opentelemetry/api';

const generatedCounter = opentelemetry.metrics
  .getMeter('mjml')
  .createCounter('generated');

/**
 * Init app
 * @param  {Object} app Express App
 */
function init(app) {
  app.get('/health', (_, res) => {
    res.sendStatus(204);
  });

  app.get('/version', (_, res) => {
    res.send(process.env.VERSION || 'development');
  });

  app.use(promBundle({ includeMethod: true }));

  app.use(json());

  app.post('/', (req, res) => {
    res.send(mjml2html(req.body.mjml));
    generatedCounter.add(1);
  });
}

export default {
  init,
};
