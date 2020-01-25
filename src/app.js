import mjml2html from 'mjml';
import { json } from 'body-parser';

/**
 * Init app
 * @param  {Object} app Express App
 */
function init(app) {
  app.use(json());

  app.get('/health', (req, res) => {
    res.sendStatus(204);
  });

  app.post('/', (req, res) => {
    res.send(mjml2html(req.body.mjml));
  });
}

export default {
  init,
};
