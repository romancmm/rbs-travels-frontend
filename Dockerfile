# Use the official Bun image as base
FROM oven/bun:alpine AS runner

# Set working directory
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy package files
COPY .env.production package.json bun.lock* ./
# Install dependencies
RUN bun install

# Copy all files (including pre-built .next from CI)
COPY --chown=nextjs:nodejs . .

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application on production
CMD ["bun", "start"]