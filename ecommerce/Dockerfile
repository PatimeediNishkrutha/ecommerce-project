# Stage 1: Build React application
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# Stage 2: Serve React application using Nginx
FROM nginx:alpine

# Copy React build files
COPY --from=build /app/build /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Allow container to access host machine
# This is added when running the container

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]