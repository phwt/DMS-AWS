FROM node:alpine

RUN mkdir -p /var/www
WORKDIR /var/www

COPY . /var/www

RUN npm install
RUN npx prisma generate

RUN npm run build
EXPOSE 80
CMD npm run start
