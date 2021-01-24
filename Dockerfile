FROM node:12.16.3-alpine AS build
ENV NPM_CONFIG_LOGLEVEL info
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g @angular/cli@9.1.5
COPY . .
EXPOSE 8888
RUN npm run build
CMD ng serve --host 0.0.0.0
