FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Build-time placeholders only: config.ts validates env at import.
# Real values arrive from the environment at runtime (compose .env).
ENV DATABASE_URL=postgres://build:build@localhost:5432/build
ENV SESSION_SECRET=build-time-placeholder-not-a-real-secret
ENV SITE_URL=http://localhost:3000
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S warren && adduser -S warren -G warren && mkdir -p /app/uploads && chown warren:warren /app/uploads
# Standalone server (traced, minimal) for the app itself.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
# Scripts (migrate, seed, create-token) run on production deps only.
COPY --from=prod-deps /app/node_modules ./node_modules
COPY db ./db
COPY scripts ./scripts
COPY src/content ./src/content
# Source files arrive with restrictive host perms; the app runs as
# the unprivileged warren user, so make the tree readable by it.
RUN chown -R warren:warren /app
USER warren
EXPOSE 3000
CMD ["node", "server.js"]
