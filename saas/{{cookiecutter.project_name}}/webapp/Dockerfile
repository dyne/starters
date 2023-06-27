FROM node:lts-alpine AS builder

ARG HOST=0.0.0.0
ENV HOST=$HOST

RUN apk add --no-cache libc6-compat
RUN wget "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -O /bin/pnpm && \
    chmod +x /bin/pnpm

WORKDIR /build

COPY . .

RUN pnpm install --frozen-lockfile

EXPOSE $NODE_PORT

CMD pnpm dev --host
