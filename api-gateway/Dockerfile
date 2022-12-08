FROM node:19-alpine
RUN npm install -g npm@8.19.3
RUN mkdir -p /var/www/gateway
WORKDIR /var/www/gateway
ADD . /var/www/gateway
RUN npm install
CMD npm run build && npm run start:prod
