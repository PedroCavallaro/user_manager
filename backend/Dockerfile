FROM node:22

WORKDIR /app

COPY . .

RUN npm install

RUN npm migration:run

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
