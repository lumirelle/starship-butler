FROM node:lts-alpine

WORKDIR /app

COPY . .
RUN npm ci && npm run build

EXPOSE 80

ENTRYPOINT [ "npm", "run", "start" ]
