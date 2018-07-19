FROM node:8

ENV NODE_ENV production

RUN apt-get update && apt-get install -y rsync

RUN npm install -q -g forever

ADD . /opt/apibuilder

WORKDIR /opt/apibuilder

RUN mkdir ./log

RUN npm install -q

RUN npm run build

ENTRYPOINT ./run.sh
