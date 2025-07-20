# Stage 1: Build React Client
FROM node:16 as build-client

WORKDIR /app
COPY client ./client
RUN cd client && npm install && npm run build

# Stage 2: Setup Server with Chromium
FROM node:16

ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
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

WORKDIR /app

COPY server ./server
COPY --from=build-client /app/client/build ./server/public

RUN cd server && npm install --production

EXPOSE 3001

CMD ["node", "server/index.js"]