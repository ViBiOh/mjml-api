FROM node:21-alpine

WORKDIR /home/node/app
EXPOSE 3000

ENV NODE_ENV production
ENTRYPOINT [ "/usr/local/bin/node", "--require", "./telemetry.js", "./index.js" ]

ARG VERSION
ENV VERSION ${VERSION}

ARG GIT_SHA
ENV GIT_SHA ${GIT_SHA}

COPY dist /home/node/app/
COPY node_modules /home/node/app/node_modules/

USER 1000
