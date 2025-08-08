FROM node:22.15-alpine

WORKDIR /app

# Install dependencies globally
RUN npm install -g npm@11.3.0

# Copy package files first for better caching
COPY package*.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force
RUN npm install

# Copy application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npm run build && npm run start"]