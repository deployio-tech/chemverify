FROM node:20 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

FROM node:20-alpine

WORKDIR /app

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]