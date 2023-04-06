FROM node:lts-alpine

COPY * /app/

WORKDIR /app

RUN npm i -g pnpm

RUN pnpm i

RUN pnpm build

CMD ["pnpm", "start:prod"]
