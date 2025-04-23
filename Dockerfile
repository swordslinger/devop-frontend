FROM node:18-alpine as build

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN npm ci

COPY ./src ./src

COPY ./public ./public


COPY ./vue.config.js ./ 
COPY ./babel.config.js ./ 

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

RUN echo $'server {\n\
    listen 80;\n\    
    location / {\n\        
        root /usr/share/nginx/html;\n\
        index index.html;\n\       
        try_files $uri $uri/ /index.html;\n\    
    }\n\
} ' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
