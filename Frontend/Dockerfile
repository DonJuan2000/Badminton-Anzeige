# Stage 1: Build Stage
FROM node:23-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies (including devDependencies for build)
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire project and build the SvelteKit app
COPY . .
RUN npm run build

# Stage 2: Production Stage
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --only=production

# Copy built app from the build stage
COPY --from=build /app/.svelte-kit /app/.svelte-kit
COPY --from=build /app/build /app/build

# Start the app
CMD ["node", "build"]
