FROM node:buster
WORKDIR /var/app/current

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY nest-cli.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY tslint.json .
COPY lib/ ./lib/
COPY src/ ./src/
RUN mkdir ./db
COPY services/ ./services/

RUN npm run build

CMD node  ./dist/src/main.js
