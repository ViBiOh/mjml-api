import mjml2html from 'mjml';
import bodyParser from 'body-parser';
import opentelemetry from '@opentelemetry/api';

const { json } = bodyParser;

const generatedCounter = opentelemetry.metrics
  .getMeter('github.com/ViBiOh/mjml-api')
  .createCounter('mjml.generated');

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

  app.use(json());

  app.post('/', (req, res) => {
    res.send(mjml2html(req.body.mjml));
    generatedCounter.add(1);
  });
}

export default {
  init,
};
