const bodyParser = require('body-parser');
const mjml2html = require('mjml');

/**
 * Init app
 * @param  {Object} app Express App
 */
function init(app) {
  app.use(bodyParser.json());

  app.get('/health', function (req, res) {
    res.sendStatus(200);
  });

  app.post('/', function (req, res) {
    res.send(mjml2html(req.body.mjml))
  });
}

export default {
  init,
};
