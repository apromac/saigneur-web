# ======================================================================
# DOCKERFILE
# CONSTRUCTION DE L'IMAGE DOCKER DU MICROSERVICE "saigneur-web"
# ======================================================================

# Stage 1
FROM node:alpine3.16 as builder-node
WORKDIR /app
COPY . .

RUN npm install && npm run build --prod

# Stage 2
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder-node /app/dist/aprosaigneur /usr/share/nginx/html
