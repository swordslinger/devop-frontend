FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY ./package.json ./package-lock.json ./
RUN npm ci

# Copy source code and public assets
COPY ./src ./src
COPY ./public ./public

COPY ./vue.config.js ./ 
COPY ./babel.config.js ./ 

RUN npm run build

# Serve the app with nginx
FROM nginx:alpine

# Copy the built app to Nginx's service directry
COPY --from=build /app/dist /usr/share/nginx/html

# Config for routing
RUN echo $'server {\n\
    listen 80;\n\    
    location / {\n\        
        root /usr/share/nginx/html;\n\
        index index.html;\n\       
        try_files $uri $uri/ /index.html;\n\    
    }\n\
} ' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
