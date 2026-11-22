# Production image of the RepTrack API (built in the CI/CD pipeline and deployed to Render)
FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

# Apply database migrations, load the test accounts (idempotent upserts) and start the API.
# DATABASE_URL, JWT_SECRET and FRONTEND_URL are set as environment variables on the hosting service.
CMD ["sh", "-c", "npx prisma migrate deploy && node prisma/seed.js && node src/server.js"]
