FROM node:11 as builder

ENV APP_NAME mjml-api
ENV WORKDIR /usr/src/app

WORKDIR ${WORKDIR}
COPY ./ ${WORKDIR}/

RUN make ${APP_NAME} \
 && mkdir -p /app \
 && cp -r dist/ /app/ \
 && cp -r node_modules/ /app/

FROM node:alpine

WORKDIR /home/node/app
EXPOSE 3000

ENV NODE_ENV production
ENTRYPOINT [ "/usr/local/bin/node", "index.js" ]

COPY --from=builder /app/dist /home/node/app/
COPY --from=builder /app/node_modules /home/node/app/node_modules/

USER node
