# ======================================================================
# DOCKERFILE
# CONSTRUCTION DE L'IMAGE DOCKER DU MICROSERVICE "saigneur-web"
# ======================================================================
# Stage 1
FROM node:alpine3.16 as builder-node
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Stage 2
FROM nginx:stable-alpine
COPY --from=builder-node /app/dist/aprosaigneur/ /usr/share/nginx/html

EXPOSE 4001



#FROM node:alpine3.16
#LABEL maintainer = "apromac <abraham.tiene@apromac.ci>"
#
#RUN mkdir /usr/local/microservice \
#&& mkdir /usr/local/microservice/msaigneur
#
#WORKDIR /usr/local/microservice/msaigneur
#COPY target/*.jar saigneur-utilisateur.jar
#
#EXPOSE 4001
#ENTRYPOINT ["java", "-jar", "saigneur-utilisateur.jar"]
