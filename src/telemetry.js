import * as otelsdk from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new otelsdk.NodeSDK({
  resource: new Resource(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'mjml-api',
    }),
  ),
  traceExporter: new OTLPTraceExporter({
    url: `${process.env.OTEL_ENDPOINT_URL}/v1/traces`,
    headers: {},
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${process.env.OTEL_ENDPOINT_URL}/v1/metrics`,
      headers: {},
    }),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();
