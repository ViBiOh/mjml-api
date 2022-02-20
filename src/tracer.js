const opentelemetry = require('@opentelemetry/sdk-node');
const api = require('@opentelemetry/api');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { AlwaysOnSampler } = require('@opentelemetry/core');
const {
  ExpressInstrumentation,
} = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { SemanticAttributes } = require('@opentelemetry/semantic-conventions');

function ignoreHealthCheck(spanName, spanKind, attributes) {
  return spanKind !== api.SpanKind.SERVER || attributes[SemanticAttributes.HTTP_ROUTE] !== "/health";
}

function filterSampler(filterFn, parent) {
  return {
    shouldSample(ctx, tid, spanName, spanKind, attr, links) {
      if (!filterFn(spanName, spanKind, attr)) {
        return { decision: api.SamplingDecision.NOT_RECORD };
      }
      return parent.shouldSample(ctx, tid, spanName, spanKind, attr, links);
    },
    toString() {
      return `FilterSampler(${parent.toString()})`;
    }
  }
}

const endpoint = process.env.JAEGER_ENDPOINT;
const serviceName = process.env.OTEL_SERVICE_NAME;

if (endpoint) {
  console.log(
    `Exporting open telemetry to Jaeger endpoint ${endpoint} as service ${serviceName}`,
  );

  const sdk = new opentelemetry.NodeSDK({
    sampler: filterSampler(ignoreHealthCheck, new AlwaysOnSampler()),
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
