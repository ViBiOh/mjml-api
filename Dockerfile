FROM node:alpine

WORKDIR /home/node/app
EXPOSE 3000
ENV NODE_ENV production
ENTRYPOINT [ "/usr/local/bin/node", "index.js" ]

COPY ./dist ./node_modules/ /home/node/app/

USER node
