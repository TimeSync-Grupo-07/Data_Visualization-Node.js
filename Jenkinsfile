pipeline {
    agent any

    environment {
        APP_NAME = "timeSync-visualization"
        PEM_FILE = "~/.ssh/minha-chave.pem"
        EC2_USER = "ubuntu"
    }

    parameters {
        string(name: 'EC2_PUBLIC_IP', defaultValue: '')
    }

    stages {
        stage('Validar IP') {
            steps {
                script {
                    if (!params.EC2_PUBLIC_IP?.trim()) {
                        error("Você deve fornecer o IP público da EC2 como parâmetro.")
                    }
                }
            }
        }

        stage('Clonar repositório') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker') {
            steps {
                sh "docker build -t $APP_NAME ."
            }
        }

        stage('Enviar imagem para EC2') {
            steps {
                sh """
                docker save $APP_NAME | bzip2 | ssh -o StrictHostKeyChecking=no -i $PEM_FILE $EC2_USER@${params.EC2_PUBLIC_IP} 'bunzip2 | docker load'
                """
            }
        }

        stage('Deploy na EC2') {
            steps {
                sh """
                ssh -o StrictHostKeyChecking=no -i $PEM_FILE $EC2_USER@${params.EC2_PUBLIC_IP} << EOF
                  docker stop $APP_NAME || true
                  docker rm $APP_NAME || true
                  docker run -d --name $APP_NAME -p 3000:3000 --env-file /home/ec2-user/.env $APP_NAME
                EOF
                """
            }
        }
    }
}
