FROM node:buster
WORKDIR /var/app/current

RUN npm i -g forever

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY nest-cli.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY tslint.json .
COPY lib/ ./lib/
RUN mkdir ./db
COPY services/ ./services/

RUN npm run build

CMD forever start  ./dist/src/main.js
