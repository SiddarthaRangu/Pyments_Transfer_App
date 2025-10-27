# --- Stage 1: Build Stage ---
# Start with an official Node.js image. 'node:18-alpine' is a lightweight version, great for production.
# The 'as builder' part gives this stage a name we can refer to later.
FROM node:18-alpine as builder

# Set the working directory inside the container. All subsequent commands will run from here.
WORKDIR /app

# Copy the package.json and package-lock.json files first.
# Docker caches layers. By copying these first, Docker won't reinstall all dependencies
# every time you change your source code, only when package.json changes. This is a key optimization.
COPY package*.json ./

# Install all dependencies, including devDependencies needed for any build steps.
RUN npm install

# Copy the rest of your backend application's source code into the container.
COPY . .


# --- Stage 2: Production Stage ---
# Now, start fresh with another Node.js image for the final, lean container.
FROM node:18-alpine

WORKDIR /app

# Copy only the package.json and package-lock.json files again.
COPY package*.json ./

# Install ONLY production dependencies. This makes the final image smaller and more secure.
# devDependencies like 'jest' and 'supertest' are not needed to RUN the app.
RUN npm install --omit=dev

# Copy the application code from the 'builder' stage.
# This is a multi-stage build. We use the first stage to build everything,
# and the second stage to create a clean, small production image.
COPY --from=builder /app .

# 'EXPOSE 3000' is documentation. It tells Docker that the container listens on port 3000.
# It doesn't actually open the port. We do that when we run the container.
EXPOSE 3000

# 'CMD' specifies the default command to run when the container starts.
# This will execute 'node index.js' to start your Express server.
CMD [ "node", "index.js" ]