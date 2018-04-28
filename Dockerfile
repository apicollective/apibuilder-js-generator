FROM node:8

ENV NODE_ENV production

RUN npm install -q -g forever

ADD . /opt/apibuilder

WORKDIR /opt/apibuilder

RUN mkdir ./log

RUN npm install -q

ENTRYPOINT ./run.sh
