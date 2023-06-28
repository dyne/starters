FROM node:lts-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN wget "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -O /bin/pnpm && \
    chmod +x /bin/pnpm

WORKDIR /build

COPY . .

EXPOSE $NODE_PORT

CMD pnpm i && pnpm dev --host
