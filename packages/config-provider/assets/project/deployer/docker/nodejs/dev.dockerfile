FROM node:lts-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

EXPOSE 8080

ENTRYPOINT [ "npm", "run", "dev" ]
