import express from 'express';
import mjml2html from 'mjml';
import opentelemetry from '@opentelemetry/api';
import telemetry from './telemetry.mjs';

const meter = opentelemetry.metrics.getMeter('github.com/ViBiOh/mjml-api');
const generatedCounter = meter.createCounter('mjml.generated');
const failedCounter = meter.createCounter('mjml.failed');
const durationHistogram = meter.createHistogram('mjml.duration', {
  unit: 'ms',
});

function httpStatus(err) {
  const status = err.status ?? err.statusCode;
  return Number.isInteger(status) && status >= 400 && status < 600
    ? status
    : 500;
}

/**
 * Init app
 * @param  {Object} app Express App
 */
function init(app) {
  app.get('/health', (_, res) => {
    res.sendStatus(204);
  });

  app.get('/ready', (_, res) => {
    res.sendStatus(204);
  });

  app.get('/version', (_, res) => {
    res.send(process.env.VERSION || 'development');
  });

  app.use(express.json());

  app.post('/', async (req, res) => {
    const source = req.body?.mjml;

    if (typeof source !== 'string' || source.length === 0) {
      failedCounter.add(1, { reason: 'invalid_request' });
      res
        .status(400)
        .json({ error: 'body must be a JSON object with a "mjml" string' });
      return;
    }

    const start = performance.now();
    let result;

    try {
      result = await mjml2html(source);
    } catch (err) {
      failedCounter.add(1, { reason: 'invalid_mjml' });
      telemetry.logger.warn('mjml conversion failed', { error: err.message });
      res.status(400).json({ error: err.message });
      return;
    }

    durationHistogram.record(performance.now() - start);
    generatedCounter.add(1);

    res.json({ html: result.html, errors: result.errors });
  });

  app.use((err, _req, res, next) => {
    if (res.headersSent) {
      next(err);
      return;
    }

    const status = httpStatus(err);

    if (status >= 500) {
      telemetry.logger.error('unexpected error', { error: err.stack });
      res.status(status).json({ error: 'Internal Server Error' });
      return;
    }

    telemetry.logger.warn('request rejected', { error: err.message });
    res.status(status).json({ error: err.message });
  });
}

export default {
  init,
};
