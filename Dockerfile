# Stage 1: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./ 
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install
COPY . .
RUN npx prisma generate && npm run build && npm prune --production


# Stage 2: Run the app
FROM node:20-bullseye

WORKDIR /app

# Create a non-root user/group and install wget in a single layer
RUN groupadd -r appgroup && useradd -r -g appgroup appuser && apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Copy necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# REMOVED: Hardcoded environment variables
# The .env file will be used instead via docker run or docker-compose

# Set the new user
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "wget", "-q", "-O", "-", "http://localhost:3000/api/docs" ] || exit 1
CMD ["node", "dist/main.js"]