FROM node:buster
WORKDIR /var/app/current

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY nest-cli.json .
COPY tsconfig.json .
COPY tslint.json .
COPY nest/ ./nest/
COPY shared/ ./shared/
RUN mkdir ./db

RUN npm run build:server

CMD node  ./dist/src/main.js
