FROM node:19-alpine
RUN npm install -g npm@8.19.3
RUN mkdir -p /var/www/todo
WORKDIR /var/www/todo
ADD . /var/www/todo
RUN npm install
CMD npm run build && npm run start:prod
