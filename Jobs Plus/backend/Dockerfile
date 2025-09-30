# Use Node.js 20 runtime
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install deps (omit dev dependencies for smaller image)
RUN npm install --omit=dev

# Copy compiled code
COPY dist ./dist

# Expose port (Amplify will route to this)
EXPOSE 4000

# Start Fastify
CMD ["node", "dist/index.js"]
