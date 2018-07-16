FROM node:alpine

WORKDIR /home/node/app
ENV NODE_ENV production
EXPOSE 3000

COPY ./ /home/node/app/
ENTRYPOINT [ "/usr/local/bin/node", "index.js", "--" ]

USER node
