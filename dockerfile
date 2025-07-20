# Step 1: Build React client (no changes here from the previous successful version)
FROM node:16-alpine as build-client

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Step 2: Build backend and serve frontend
FROM node:16-alpine

WORKDIR /app

# Install backend dependencies
COPY server/package.json server/package-lock.json ./
RUN npm install

# --- IMPORTANT: Add these lines for Puppeteer/Chromium dependencies ---
# Install necessary packages for Puppeteer to run headless Chrome
# 'chromium' is the official headless browser for Alpine Linux
# 'udev' might be needed for certain device interactions, though often optional
RUN apk add --no-cache chromium udev

# Add these arguments to npm install for puppeteer to avoid downloading a new browser
# This tells puppeteer to skip downloading the bundled Chromium browser,
# as we're providing it via the 'chromium' package installed above.
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# --- End of important additions ---

# Copy backend code
COPY server/ ./

# Copy built React files from previous stage
COPY --from=build-client /app/client/build ./public

# Expose port
EXPOSE 3001

# Start server
# Also, consider passing the --no-sandbox flag if you face issues with permissions
# inside the container, especially in cloud environments.
CMD ["node", "index.js", "--no-sandbox"]