FROM node:12-alpine as dev-build
WORKDIR /usr/src/app
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

FROM node:12-alpine as prod-build
WORKDIR /usr/src/app

COPY server/package*.json ./
RUN npm install
COPY server .

COPY --from=dev-build /usr/src/app/dist /usr/src/client/dist

CMD [ "npm", "start" ]