FROM node:15-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn

COPY . /app

CMD ["yarn", "dev"]
