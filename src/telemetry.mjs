import * as otelsdk from '@opentelemetry/sdk-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node';
import { ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import opentelemetry from '@opentelemetry/api';
import winston from 'winston';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes, envDetector } from '@opentelemetry/resources';

const sdkDisabled = process.env.OTEL_SDK_DISABLED === 'true';

if (!sdkDisabled && !process.env.OTEL_ENDPOINT_URL) {
  throw new Error('OTEL_ENDPOINT_URL is required');
}

const resourceAttributes = Object.fromEntries(
  Object.entries({
    ...envDetector.detect().attributes,
    [ATTR_SERVICE_VERSION]: process.env.VERSION,
    'git.commit.sha': process.env.GIT_SHA,
  }).filter(([, value]) => value !== undefined),
);

function tracingFormat() {
  return winston.format((info) => {
    const span = opentelemetry.trace.getSpan(opentelemetry.context.active());

    if (span) {
      const { spanId, traceId } = span.spanContext();
      const traceIdEnd = traceId.slice(traceId.length / 2);

      info.trace_id = BigInt(`0x${traceIdEnd}`).toString();
      info.span_id = BigInt(`0x${spanId}`).toString();
    }

    return Object.assign(info, resourceAttributes);
  })();
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  format: winston.format.combine(tracingFormat(), winston.format.json()),
});

function createSDK() {
  const endpoint = process.env.OTEL_ENDPOINT_URL;
  const url = /^https?:\/\//.test(endpoint) ? endpoint : `http://${endpoint}`;

  return new otelsdk.NodeSDK({
    resource: resourceFromAttributes(resourceAttributes),
    resourceDetectors: [envDetector],
    instrumentations: [
      new RuntimeNodeInstrumentation({}),
      new HttpInstrumentation({
        ignoreIncomingRequestHook: (request) => {
          return /^\/(health|ready)(\?|$)/.test(request.url);
        },
      }),
    ],
    traceExporter: new OTLPTraceExporter({ url }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({ url }),
    }),
    views: [
      {
        meterName: '@opentelemetry/instrumentation-http',
        attributeKeys: ['http.request.method', 'http.response.status_code'],
      },
    ],
  });
}

const sdk = sdkDisabled ? undefined : createSDK();
sdk?.start();

/**
 * Flush pending telemetry and stop the SDK.
 */
async function shutdown() {
  try {
    await sdk?.shutdown();
  } catch (err) {
    logger.error('telemetry shutdown failed', { error: err.message });
  }
}

export default {
  logger,
  shutdown,
};
