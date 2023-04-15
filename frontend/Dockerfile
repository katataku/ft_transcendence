FROM node:latest

WORKDIR /app

COPY ./ ./

RUN npm install

EXPOSE 3000

CMD [ "./scripts/wait-for-it/wait-for-it.sh", "--timeout=300", "backend:3001", "--", "npm", "start" ]
