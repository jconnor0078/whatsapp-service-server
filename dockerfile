FROM node:20-alpine AS builder

WORKDIR /main

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build


FROM node:20-alpine

WORKDIR /main

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /main/dist ./dist

EXPOSE 8888

CMD ["npm", "start"]