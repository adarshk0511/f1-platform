FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/src ./src
COPY --from=builder /app/keys ./keys
COPY --from=builder /app/package.json ./package.json

EXPOSE 8080

CMD ["npm", "start"]