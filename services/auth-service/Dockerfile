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
COPY --from=builder /app/keys/access-token-public.pem ./keys/access-token-public.pem
COPY --from=builder /app/package.json ./package.json

EXPOSE 5001

CMD ["npm", "start"]