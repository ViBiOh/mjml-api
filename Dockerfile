FROM node:20-alpine

WORKDIR /home/node/app
EXPOSE 3000

ENV NODE_ENV production
ENTRYPOINT [ "/usr/local/bin/node", "index.js" ]

ARG VERSION
ENV VERSION=${VERSION}

COPY dist /home/node/app/
COPY node_modules /home/node/app/node_modules/

USER 1000
