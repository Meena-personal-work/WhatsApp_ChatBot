# Stage 1: Build React Client
FROM node:16-alpine as build-client

WORKDIR /app

# Copy and build the client
COPY client ./client
RUN cd client && npm install && npm run build

# Stage 2: Setup Server
FROM node:16-alpine

ENV NODE_ENV=production
WORKDIR /app

# Copy server files
COPY server ./server

# Copy React build to server/public
COPY --from=build-client /app/client/build ./server/public

# Install only production dependencies
RUN cd server && npm install --production

# Expose server port
EXPOSE 3001

# Start backend (which will serve React from /public)
CMD ["node", "server/index.js"]