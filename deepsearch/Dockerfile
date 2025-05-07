# Use official Node.js image as the base image
FROM node:23

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
COPY package.json package-lock.json ./

# Install dependencies inside the container
RUN npm install

# Copy all project files into the container
COPY . .

# Expose the port your app runs on
# EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]