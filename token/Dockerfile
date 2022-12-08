FROM node:19-alpine
RUN npm install -g npm@8.19.3
RUN mkdir -p /var/www/token
WORKDIR /var/www/token
ADD . /var/www/token
RUN npm install
CMD npm run build && npm run start:prod
