FROM node:alpine

RUN mkdir -p /var/www
WORKDIR /var/www

COPY . /var/www

RUN rm .env
RUN mv .env.production .env

RUN npm install
RUN npx prisma generate

RUN npm run build
EXPOSE 3001
CMD npm run start
