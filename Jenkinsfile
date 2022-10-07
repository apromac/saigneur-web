pipeline {
  agent any
  tools {
    maven "Maven386"
  }
  environment {
    DOCKER_IMAGE_NAME = "saigneur-web"
    CONTAINER_NAME = "msaigneur-web"
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
  }
}
