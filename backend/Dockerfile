# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your app runs on
EXPOSE 3001

# Command to run the app
CMD ["node", "app.js"]

