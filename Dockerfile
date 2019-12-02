FROM alpine
RUN apk add --update nodejs npm
ADD . .
RUN npm install

CMD ["node", "index.js"]
EXPOSE 9591