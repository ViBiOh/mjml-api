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
  --version         Show version number                                [boolean]
  --workerCount     Worker count for cluster mode                   [default: 1]
  --listenDuration  Number of seconds during the server is started before
                    shutting down.                                  [default: 0]
  --listenPort      Listening port                    [required] [default: 3000]
  --listenHost      Listening host                        [string] [default: ""]
  --help            Show help                                          [boolean]
```

### HTTP Usage

```bash
curl --request POST --header 'Content-type: application/json' http://127.0.0.1:3000 --data '{"mjml":"<mjml><mj-body></mj-body></mjml>"}'

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
