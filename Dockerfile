FROM node:18-slim

# Non-interactive CI environment
ENV NODE_ENV=test
ENV CI=true

WORKDIR /usr/src/app

# Install dependencies from package.json
COPY package*.json ./
RUN npm install

# Copy repository files
COPY . .

# Default command: run tests
CMD ["npm", "test"]
