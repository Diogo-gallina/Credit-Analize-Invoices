FROM node:22.1.0 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
