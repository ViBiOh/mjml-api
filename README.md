# mjml-api

[![Build](https://github.com/ViBiOh/mjml-api/workflows/Build/badge.svg)](https://github.com/ViBiOh/mjml-api/actions)

Convert MJML to HTML.

## Getting Started

You can configure app by passing CLI args or environment variables (cf. [Usage](#usage) section).

You'll find a Kubernetes exemple in the [`infra/`](infra) folder, using my [`app chart`](https://github.com/ViBiOh/charts/tree/main/app).

## Usage

The application can be configured by passing CLI args described below or their equivalent as environment variable. CLI values take precedence over environments variables.

Be careful when using the CLI values, if someone list the processes on the system, they will appear in plain-text. Pass secrets by environment variables: it's less easily visible.

```bash
node dist/index.js --help
Options:
  --version      Show version number                                   [boolean]
  --port         Listening port                                  [default: 3000]
  --workerCount  Worker count for cluster mode                      [default: 1]
  --help         Show help                                             [boolean]
```

### HTTP Usage

```bash
curl -H 'Content-type: application/json' http://localhost:3000 -d '{"mjml":"<mjml><mj-body></mj-body></mjml>"}'

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
