FROM node:18-alpine

# Set the working directory
ENV NODE_ENV=${NODE_ENV:-DEV}

WORKDIR /app

RUN mkdir -p -m 0755 /app/server

# Add files
COPY ./server /app/server

RUN npm config set strict-ssl false

RUN cd /app/server && npm ci --without-ssl --insecure

EXPOSE 3001

CMD sh -c 'cd $WORKDIR/app/server && node ./index.js'