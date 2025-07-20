# Step 1: Build React client
FROM node:16-alpine as build-client

WORKDIR /app/client

# Install dependencies and build the React app
COPY client/package.json client/package-lock.json ./ 
RUN npm install
COPY client/ ./
RUN npm run build

# Step 2: Build backend and serve frontend
FROM node:16-alpine

WORKDIR /app

# Install backend dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy backend code
COPY . .

# Copy built React files from previous stage
COPY --from=build-client /app/client/build ./public

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "index.js"]