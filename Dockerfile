# Use Node.js 16 as the base image
FROM node:16

# Copy project files into the /app directory
COPY . /app

# Set the working directory to /app
WORKDIR /app

# Install application dependencies
RUN npm install

# Set the environment to production
#ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Specify the command to start the application
CMD ["node", "dist/main"]
