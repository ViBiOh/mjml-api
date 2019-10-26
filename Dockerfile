FROM node:13 as builder

WORKDIR /usr/src/app
COPY . .

RUN make mjml

FROM node:alpine

WORKDIR /home/node/app
EXPOSE 3000

ENV NODE_ENV production
ENTRYPOINT [ "/usr/local/bin/node", "index.js" ]

COPY --from=builder /usr/src/app/dist /home/node/app/
COPY --from=builder /usr/src/app/node_modules /home/node/app/node_modules/

USER node
