FROM node:19-alpine
RUN npm install -g npm@8.19.3
RUN mkdir -p /var/www/user
WORKDIR /var/www/user
ADD . /var/www/user
RUN npm install
CMD npm run build && npm run start:prod
