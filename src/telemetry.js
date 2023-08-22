import * as otelsdk from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import {
  PeriodicExportingMetricReader,
  View,
} from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new otelsdk.NodeSDK({
  resource: new Resource(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'mjml-api',
    }),
  ),
  traceExporter: new OTLPTraceExporter({
    url: `http://${process.env.OTEL_ENDPOINT_URL}`,
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `http://${process.env.OTEL_ENDPOINT_URL}`,
    }),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  views: new View({
    meterName: '@opentelemetry/instrumentation-http',
    attributeKeys: ['http.method', 'http.status_code'],
  }),
});
sdk.start();
