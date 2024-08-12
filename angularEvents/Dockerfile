FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build --configuration angularEvents-

RUN npm run build --prod

FROM nginx:latest

COPY --from=build /app/dist/angular-events/browser /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]