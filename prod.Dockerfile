FROM node:10 as build-stage
#FROM node:8.15 as build-stage

#Create folder /app and working with /app folder
RUN mkdir -p /data/app

#Copy source code to app
WORKDIR /data/app
COPY . /data/app
RUN npm install && npm cache clean --force
RUN ls /data/app/nginx
RUN ls /data/app/

#Default on container port is 3000
#EXPOSE 3000
RUN npm run build:prod
RUN ls /data/app/
RUN ls /data/app/dist/akachain-development-tool
#Start npm when run container
#CMD ["npm", "start"]

FROM nginx:1.15
RUN mkdir -p /nginx/conf/
RUN mkdir -p /var/www/akachain-development-tool
COPY --from=build-stage /data/app/nginx/prod-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /data/app/dist/akachain-development-tool /var/www/akachain-development-tool
