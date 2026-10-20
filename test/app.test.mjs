import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import telemetry from '../src/telemetry.mjs';
import app from '../src/app.mjs';

const VALID_MJML =
  '<mjml><mj-body><mj-section><mj-column><mj-text>hello</mj-text></mj-column></mj-section></mj-body></mjml>';

describe('app', () => {
  let server;
  let baseURL;

  before(async () => {
    telemetry.logger.silent = true;

    const expressApp = express();
    app.init(expressApp);

    await new Promise((resolve) => {
      server = expressApp.listen(0, '127.0.0.1', resolve);
    });
    baseURL = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  function post(body, headers = { 'content-type': 'application/json' }) {
    return fetch(baseURL, { method: 'POST', headers, body });
  }

  it('answers probes', async () => {
    assert.equal((await fetch(`${baseURL}/health`)).status, 204);
    assert.equal((await fetch(`${baseURL}/ready`)).status, 204);
  });

  it('exposes the version', async () => {
    const response = await fetch(`${baseURL}/version`);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), process.env.VERSION || 'development');
  });

  it('converts mjml to html', async () => {
    const response = await post(JSON.stringify({ mjml: VALID_MJML }));
    assert.equal(response.status, 200);

    const payload = await response.json();
    assert.deepEqual(Object.keys(payload).sort(), ['errors', 'html']);
    assert.match(payload.html, /hello/);
    assert.deepEqual(payload.errors, []);
  });

  for (const [name, body, headers] of [
    ['missing mjml key', JSON.stringify({})],
    ['non string mjml', JSON.stringify({ mjml: 5 })],
    ['empty mjml', JSON.stringify({ mjml: '' })],
    ['array body', JSON.stringify([VALID_MJML])],
    ['malformed mjml', JSON.stringify({ mjml: '<mjml><bad' })],
    ['missing content type', 'x', {}],
    ['invalid json', '{'],
  ]) {
    it(`rejects ${name} with 400`, async () => {
      const response = await post(body, headers);
      assert.equal(response.status, 400);
      assert.equal(typeof (await response.json()).error, 'string');
    });
  }

  it('rejects oversized body with 413', async () => {
    const response = await post(JSON.stringify({ mjml: 'a'.repeat(200000) }));
    assert.equal(response.status, 413);
  });

  it('does not read files through mj-include', async () => {
    const response = await post(
      JSON.stringify({
        mjml: '<mjml><mj-body><mj-include path="/etc/hosts" /></mj-body></mjml>',
      }),
    );
    assert.equal(response.status, 200);
    assert.doesNotMatch((await response.json()).html, /localhost/);
  });
});
