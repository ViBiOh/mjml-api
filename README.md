# mjml-api

[![Build Status](https://travis-ci.com/ViBiOh/mjml-api.svg?branch=master)](https://travis-ci.com/ViBiOh/mjml-api)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=ViBiOh/mjml-api)](https://dependabot.com)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ViBiOh_mjml-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=ViBiOh_mjml-api)

Convert MJML to HTML.

## Getting Started

A Docker image is available for `amd64`, `arm` and `arm64` platforms on Docker Hub: [vibioh/mjml](https://hub.docker.com/r/vibioh/mjml/tags).

You can configure app by passing CLI args or environment variables (cf. [Usage](#usage) section). CLI override environment variables.

You'll find a Kubernetes exemple (without secrets) in the [`infra/`](infra/) folder.

## Usage

```bash
curl -H 'Content-type: application/json' http://localhost:3000 -d '{"mjml":"<mjml></mjml>"}'

{
  "html":"
    <!doctype html>
    <html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">
      <head>
      </head>
      <body>
      </body>
    </html>
  ",
  "errors":[]
}
```
