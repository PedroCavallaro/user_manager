FROM node:22

WORKDIR /app

COPY . .

RUN npm install


EXPOSE 4000

CMD [ "npm", "run", "migration:run", "&&"  "npm", "run", "start:prod"]
