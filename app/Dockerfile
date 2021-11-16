FROM node:12

WORKDIR /app

COPY package*json ./

RUN npm install

COPY . .

EXPOSE 443

EXPOSE 80

CMD ["npm", "run", "bgServer"]