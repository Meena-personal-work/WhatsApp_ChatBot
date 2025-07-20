# Stage 1: Build React Client
FROM node:16-alpine as build-client

WORKDIR /app
COPY client ./client

RUN cd client && npm install && npm run build

# Stage 2: Setup Server with Puppeteer Support
FROM node:16

WORKDIR /app

# Install Chromium dependencies for puppeteer/whatsapp-web.js
RUN apt-get update && \
    apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable so puppeteer knows where Chrome is
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy server code
COPY server ./server

# Copy built React app into server's public folder
COPY --from=build-client /app/client/build ./server/public

# Install server dependencies
RUN cd server && npm install --production

# Expose the server port
EXPOSE 3001

# Start the app
CMD ["node", "server/index.js"]