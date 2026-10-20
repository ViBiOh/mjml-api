import cluster from 'cluster';
import telemetry from './telemetry.mjs';

const SHUTDOWN_TIMEOUT_MS = 10000;
const RESPAWN_DELAY_MS = 1000;

async function exitAfterFlush(code) {
  await telemetry.shutdown();
  process.exit(code);
}

function forceExitAfterTimeout() {
  setTimeout(() => process.exit(1), SHUTDOWN_TIMEOUT_MS).unref();
}

/**
 * Init server.
 * @param  {Object} app     Express App
 * @param  {Object} options Yargs options
 */
function init(app, options) {
  const server = app.listen(options.listenPort, options.listenHost, () => {
    telemetry.logger.info(
      `Starting HTTP server on ${options.listenHost}:${options.listenPort}`,
    );
  });

  let stopping = false;

  const stop = () => {
    if (stopping) {
      return;
    }
    stopping = true;

    telemetry.logger.info('Stopping HTTP server');
    forceExitAfterTimeout();
    server.close(() => exitAfterFlush(0));
  };

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);

  if (options.listenDuration !== 0) {
    telemetry.logger.info(
      `HTTP server will stop in ${options.listenDuration}s`,
    );

    setTimeout(stop, options.listenDuration * 1000);
  }
}

/**
 * Init cluster primary: fork workers, replace crashed ones and relay shutdown.
 * @param  {Object} options Yargs options
 */
function initPrimary(options) {
  let stopping = false;

  for (let i = 0; i < options.workerCount; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    if (stopping) {
      if (Object.keys(cluster.workers).length === 0) {
        exitAfterFlush(0);
      }
      return;
    }

    telemetry.logger.warn(`worker ${worker.process.pid} died`, {
      code,
      signal,
    });

    setTimeout(() => {
      if (!stopping) {
        cluster.fork();
      }
    }, RESPAWN_DELAY_MS);
  });

  const stop = () => {
    if (stopping) {
      return;
    }
    stopping = true;

    telemetry.logger.info('Stopping workers');
    forceExitAfterTimeout();

    const workers = Object.values(cluster.workers);
    if (workers.length === 0) {
      exitAfterFlush(0);
      return;
    }

    workers.forEach((worker) => worker.kill('SIGTERM'));
  };

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}

export default {
  init,
  initPrimary,
};
