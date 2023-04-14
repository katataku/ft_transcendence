FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 3001

COPY ./ ./

CMD [ "./scripts/wait-for-it/wait-for-it.sh", "--timeout=300", "db:5432", "--", "npm", "run", "start:dev" ]