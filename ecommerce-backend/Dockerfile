FROM node:18-alpine

WORKDIR /app

# Create directories with root permissions first
RUN mkdir -p middleware logs && \
    chown -R node:node middleware logs

# Copy package files first for better caching
COPY --chown=node:node package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false && \
    yarn cache clean

# Copy the rest of the application
COPY --chown=node:node . .

# Use the node user that comes with the image (better than creating new user)
USER node

EXPOSE 5000

CMD ["node", "server.js"]