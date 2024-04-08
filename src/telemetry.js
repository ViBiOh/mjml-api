import * as otelsdk from '@opentelemetry/sdk-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import {
  PeriodicExportingMetricReader,
  View,
} from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';

const sdk = new otelsdk.NodeSDK({
  resource: new Resource({}),
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
