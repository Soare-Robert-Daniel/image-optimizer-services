FROM node:15

WORKDIR /home/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000
EXPOSE 35729