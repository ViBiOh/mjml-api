const opentelemetry = require('@opentelemetry/api');
const sdkNode = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const {
  SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');
const { AlwaysOnSampler } = require('@opentelemetry/core');
const {
  ExpressInstrumentation,
} = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

const sdk = new sdkNode.NodeSDK({
  traceExporter: new JaegerExporter({
    serviceName: process.env.OTEL_SERVICE_NAME,
    endpoint: process.env.JAEGER_ENDPOINT,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

export default (serviceName) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
    sampler: new AlwaysOnSampler(),
  });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [HttpInstrumentation, ExpressInstrumentation],
  });

  const exporter = new JaegerExporter({
    serviceName,
    endpoint: process.env.JAEGER_ENDPOINT,
  });

  provider.addSpanProcessor(new BatchSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer(serviceName);
};
