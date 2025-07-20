# Step 1: Build React client
FROM node:16-alpine as build-client

WORKDIR /app/client

# Install client dependencies and build the React app
# We copy package.json and package-lock.json first to leverage Docker cache
COPY client/package.json client/package-lock.json ./
RUN npm install

# Copy the rest of the client code
COPY client/ ./
RUN npm run build

# Step 2: Build backend and serve frontend
FROM node:16-alpine

WORKDIR /app

# Install backend dependencies
# Copy package.json and package-lock.json from the 'server' directory
COPY server/package.json server/package-lock.json ./

RUN npm install

# Copy backend code
# Copy the entire 'server' directory contents to the current WORKDIR (/app)
COPY server/ ./

# Copy built React files from previous stage to the public directory of the backend
# Assuming your backend serves static files from a 'public' directory within its own context.
# Based on your image, 'public' is inside 'client', and your backend has its own 'server' directory.
# So, the built client (build folder) needs to go into the 'public' directory relative to the backend's root.
COPY --from=build-client /app/client/build ./public

# Expose port (assuming your Node.js backend listens on 3001)
EXPOSE 3001

# Start server
# The index.js for the server is directly under the 'server' directory, which we copied to /app
CMD ["node", "index.js"]