# mjml-api

[![Build](https://github.com/ViBiOh/mjml-api/workflows/Build/badge.svg)](https://github.com/ViBiOh/mjml-api/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ViBiOh_mjml-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=ViBiOh_mjml-api)

Convert MJML to HTML.

## Getting Started

A Docker image is available for `amd64`, `arm` and `arm64` platforms on Docker Hub: [vibioh/mjml](https://hub.docker.com/r/vibioh/mjml/tags).

You can configure app by passing CLI args or environment variables (cf. [Usage](#usage) section).

You'll find a Kubernetes exemple in the [`infra/`](infra/) folder, using my [`app chart`](https://github.com/ViBiOh/charts/tree/main/app)

## Usage

```bash
node dist/index.js --help
Options:
  --version  Show version number                                       [boolean]
  --port     Listening port                                      [default: 3000]
  --help     Show help                                                 [boolean]
```

### HTTP Usage

```bash
curl -H 'Content-type: application/json' http://localhost:3000 -d '{"mjml":"<mjml></mjml>"}'

{
  "html":"
    <!doctype html>
    <html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">
      HTML_EMAIL_CONTENT
    </html>
  ",
  "errors":[]
}
```
