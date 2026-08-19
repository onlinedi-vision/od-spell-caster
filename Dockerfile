FROM oven/bun:canary-alpine AS base

WORKDIR /app

COPY package.json bun.lock tsconfig.json ./
RUN bun install --frozen-lockfile

COPY --link *.ts .

FROM base AS test

COPY spell.test.js ./

RUN bun test

FROM test AS build

RUN bun build ./main.ts --compile --outfile spell --minify

FROM alpine AS runtime

WORKDIR /app 

COPY --from=build /app/spell /app/spell

ENTRYPOINT ["/app/spell"]