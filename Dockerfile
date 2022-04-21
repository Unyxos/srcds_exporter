FROM node:16.14.2-alpine

WORKDIR /srcds_exporter

COPY . .
RUN npm install pm2 -g
RUN npm install

CMD ["pm2-runtime", "index.js"]