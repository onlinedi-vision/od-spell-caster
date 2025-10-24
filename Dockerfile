FROM oven/bun:slim AS build

COPY main.ts main.ts
COPY util.ts util.ts
COPY consts.ts consts.ts

ENTRYPOINT ["bun", "run", "main.ts"]
