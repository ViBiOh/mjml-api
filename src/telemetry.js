import * as otelsdk from '@opentelemetry/sdk-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import opentelemetry from '@opentelemetry/api';
import winston from 'winston';
import {
  PeriodicExportingMetricReader,
  View,
} from '@opentelemetry/sdk-metrics';
import { Resource, envDetector } from '@opentelemetry/resources';

function tracingFormat() {
  return winston.format((info) => {
    const span = opentelemetry.trace.getSpan(opentelemetry.context.active());

    if (span) {
      const { spanId, traceId } = span.spanContext();
      const traceIdEnd = traceId.slice(traceId.length / 2);

      info.trace_id = BigInt(`0x${traceIdEnd}`).toString();
      info.span_id = BigInt(`0x${spanId}`).toString();
    }

    return info;
  })();
}

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(tracingFormat(), winston.format.json()),
});

const sdk = new otelsdk.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME,
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.VERSION,
    'git.commit.sha': process.env.GIT_SHA,
  }),
  resourceDetectors: [envDetector],
  instrumentations: [
    new HttpInstrumentation({
      ignoreIncomingPaths: ['/health'],
    }),
  ],
  traceExporter: new OTLPTraceExporter({
    url: `http://${process.env.OTEL_ENDPOINT_URL}`,
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `http://${process.env.OTEL_ENDPOINT_URL}`,
    }),
  }),
  views: new View({
    meterName: '@opentelemetry/instrumentation-http',
    attributeKeys: ['http.method', 'http.status_code'],
  }),
});
sdk.start();

process.on('SIGTERM', sdk.shutdown);

export default {
  logger,
};
