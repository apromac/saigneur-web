pipeline {
  agent any
  environment {
    DOCKER_IMAGE_NAME = "saigneur-web"
    CONTAINER_NAME = "msaigneur-web"
    REGISTRY = 'apromac/saigneur-web'
    BUILD_TAG = "1.0.${BUILD_NUMBER}"
    DOCKERHUB_CREDENTIALS = credentials('dockerhub')
  }
  stages {
    stage('Build and start container') {
      steps {
        echo '--------------------< Compilation du docker-compose >--------------------'
        sh 'docker compose build'

        echo '--------------------< Lancement du docker-compose (containers) >--------------------'
        sh 'docker compose up -d'

        echo '--------------------< Affichage des containers actifs >--------------------'
        sh 'docker ps'
      }
    }

    stage('Push image on the docker hub') {
      steps {
        echo '--------------------< Connexion au docker hub >--------------------'
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'

        echo '--------------------< Tag docker image for build tag>--------------------'
        sh 'docker image tag ${DOCKER_IMAGE_NAME}:latest ${REGISTRY}:${BUILD_TAG}'

        echo '--------------------< Push tag version >--------------------'
        sh 'docker push ${REGISTRY}:${BUILD_TAG}'

        echo '--------------------< Tag docker image for latest version >--------------------'
        sh 'docker image tag ${DOCKER_IMAGE_NAME}:latest ${REGISTRY}:latest'

        echo '--------------------< Push latest version >--------------------'
        sh 'docker push ${REGISTRY}:latest'
      }
    }  
  }

  post {
    always {
      sh 'docker logout'
    }
  }
}
