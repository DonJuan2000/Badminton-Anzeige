# Use the official Node.js image as the base image
FROM node:23-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your application files into the container
COPY . .

# Start the server
CMD ["node", "server.js"]
