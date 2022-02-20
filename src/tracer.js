const opentelemetry = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { AlwaysOnSampler } = require('@opentelemetry/core');
const {
  ExpressInstrumentation,
} = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const endpoint = process.env.JAEGER_ENDPOINT;
const serviceName = process.env.OTEL_SERVICE_NAME;

if (endpoint) {
  console.log(
    `Exporting open telemetry to Jaeger endpoint ${endpoint} as service ${serviceName}`,
  );

  const sdk = new opentelemetry.NodeSDK({
    sampler: new AlwaysOnSampler(),
    traceExporter: new JaegerExporter({
      serviceName,
      endpoint,
    }),
    instrumentations: [
      getNodeAutoInstrumentations(),
      HttpInstrumentation,
      ExpressInstrumentation,
    ],
  });

  sdk.start();
}
