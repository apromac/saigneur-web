pipeline {
    agent any
    environment {
        DOCKER_IMAGE_NAME = "saigneur-web"
        BUILD_TAG = "v0.0.${BUILD_NUMBER}"
        CONTAINER_NAME = "msaigneur-web"
    }

    stages {
        stage ('Arret et suppression du conteneur si celui-ci existe') {
            steps {
                echo 'Arret du conteneur'
                script{
                    try{
                        sh 'docker container ls -a -fname=${CONTAINER_NAME} -q | xargs -r docker stop'
                    }catch(error){
                        echo 'error Arret du conteneur'
                    }
                }
                echo 'Suppression du conteneur'
                script{
                    try {
                        sh 'docker container ls -a -fname=${CONTAINER_NAME} -q | xargs -r docker rm'
                        echo 'Affichage des conteneurs existant'
                        sh 'docker ps'
                    } catch(error) {
                        echo 'error Suppression du conteneur'+error
                    }
                }
            }
        }
        //
        stage ('Arret et suppression des images du webservice') {
            steps {
            echo 'Suppression des images none'
                script{
                    try{
                        sh 'docker images -f "dangling=true" -q'
                        echo 'Affichage des images existant'
                        sh 'docker images'
                    } catch(error) {
                        echo 'error Suppression des images none'+error
                    }
                }
            echo 'Suppression des images'
                script{
                    try {
                        sh 'docker rmi -f $(docker images ${DOCKER_IMAGE_NAME} -a -q)'
                    } catch(error) {
                        echo 'error Suppression des images'+error
                    }
                }
            }
        }
        //
        stage('docker-compose') {
            steps {
                echo 'Trying to Build Docker Compose'
                sh 'docker compose build'

                echo 'Trying to Up Docker Compose'
                sh 'docker compose up -d'

                echo 'Affichage des containers'
                sh 'docker ps'
            }
        }
        
    }
}
