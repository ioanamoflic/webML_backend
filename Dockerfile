FROM node:14.16

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY . .

RUN node -v
RUN npm install