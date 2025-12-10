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

# Copy configuration files
COPY --chown=nextjs:nodejs next.config.ts ./

# Set proper permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application on production
CMD ["bun", "start"]