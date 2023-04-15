FROM node:latest

WORKDIR /app

COPY ./ ./

RUN npm install

EXPOSE 3001

RUN npm run build

CMD [ "./scripts/wait-for-it/wait-for-it.sh", "--timeout=300", "db:5432", "--", "node", "dist/src/main.js" ]
# CMD [ "./scripts/wait-for-it/wait-for-it.sh", "--timeout=300", "db:5432", "--", "npm", "run", "start:dev" ]
