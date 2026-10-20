import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const ENTRYPOINT = fileURLToPath(new URL('../src/index.mjs', import.meta.url));
const EXIT_TIMEOUT_MS = 8000;

function start(args) {
  const child = spawn(process.execPath, [ENTRYPOINT, ...args], {
    env: { ...process.env, OTEL_SDK_DISABLED: 'true' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let output = '';
  child.stdout.on('data', (chunk) => (output += chunk));
  child.stderr.on('data', (chunk) => (output += chunk));

  const ready = new Promise((resolve) => {
    const timer = setInterval(() => {
      if (output.includes('Starting HTTP server')) {
        clearInterval(timer);
        resolve();
      }
    }, 50);
  });

  return { child, ready, output: () => output };
}

async function stopWithSignal(args, signal) {
  const { child, ready } = start(args);

  try {
    await ready;
    child.kill(signal);

    const timeout = setTimeout(() => child.kill('SIGKILL'), EXIT_TIMEOUT_MS);
    const [code, killedBy] = await once(child, 'exit');
    clearTimeout(timeout);

    return { code, killedBy };
  } finally {
    child.kill('SIGKILL');
  }
}

describe('server', () => {
  it('exits gracefully on SIGTERM', async () => {
    const result = await stopWithSignal(['--listenPort', '0'], 'SIGTERM');
    assert.deepEqual(result, { code: 0, killedBy: null });
  });

  it('exits gracefully on SIGTERM in cluster mode', async () => {
    const result = await stopWithSignal(
      ['--listenPort', '0', '--workerCount', '2'],
      'SIGTERM',
    );
    assert.deepEqual(result, { code: 0, killedBy: null });
  });

  it('stops by itself after listenDuration', async () => {
    const { child, ready } = start([
      '--listenPort',
      '0',
      '--listenDuration',
      '1',
    ]);

    try {
      await ready;
      const [code] = await once(child, 'exit');
      assert.equal(code, 0);
    } finally {
      child.kill('SIGKILL');
    }
  });

  it('rejects an invalid port', async () => {
    const { child } = start(['--listenPort=abc']);

    try {
      const [code] = await once(child, 'exit');
      assert.notEqual(code, 0);
    } finally {
      child.kill('SIGKILL');
    }
  });
});
