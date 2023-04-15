FROM node:latest

WORKDIR /app

COPY ./ ./

RUN npm install

EXPOSE 3001

RUN npm run build

CMD [ "node", "dist/src/main.js" ]
# CMD [ "npm", "run", "start:dev" ]