### STAGE 1: Build ###
FROM node:14.16.0 AS build
WORKDIR /usr/src/app
ARG environment
ENV PORT=$environment
RUN echo "Oh dang look at port ${PORT}"

COPY package.json ./
RUN npm config set registry http://registry.npmjs.org/ 
RUN npm install


COPY . .
#RUN ng serve

#RUN npm run build:${PORT}
RUN npm run build
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/MicroCertification /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
#COPY ./lxp.crt /etc/ssl/certs/
#COPY ./lxp.key /etc/ssl/certs/