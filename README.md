# mjml-api

[![Build Status](https://travis-ci.org/ViBiOh/mjml-api.svg?branch=master)](https://travis-ci.org/ViBiOh/mjml-api)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=ViBiOh/mjml-api)](https://dependabot.com)

Convert MJML to HTML.

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
