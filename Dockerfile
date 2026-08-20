FROM oven/bun:canary-alpine AS base
WORKDIR /app
COPY --link package.json bun.lock tsconfig.json ./
RUN bun install --frozen-lockfile
COPY --link *.ts .

FROM base AS builder
RUN bun build ./main.ts --compile --outfile spell --minify

FROM alpine AS runtime
WORKDIR /app
RUN apk add --no-cache libstdc++
COPY --link --from=builder /app/spell /app/spell
ENTRYPOINT ["/app/spell"]