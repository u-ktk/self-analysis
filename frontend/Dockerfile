FROM node:18 AS base

WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm install
COPY . /frontend/

FROM base AS development
RUN npm run build
CMD [ "npm", "start" ]

FROM nginx:latest AS production
COPY --from=development /frontend/build /var/www
COPY nginx.conf /etc/nginx/conf.d/default.conf