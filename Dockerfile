FROM oven/bun:slim AS base

WORKDIR /app

COPY package.json bun.lock tsconfig.json ./
RUN bun install --frozen-lockfile

COPY main.ts util.ts consts.ts ./

FROM base AS test

COPY spell.test.js ./
RUN bun test

FROM test AS runtime

ENTRYPOINT ["bun", "run", "main.ts"]
