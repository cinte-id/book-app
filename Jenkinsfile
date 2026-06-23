pipeline {
    agent any

    environment {
        DOCKER_USER    = "jodyys"
        IMAGE_BACKEND  = "bookapp-backend"
        IMAGE_FRONTEND = "bookapp-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                git(
                    branch: 'devops-test',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/jodyys/book-app.git'
                )
            }
        }

        stage('Lint & Test') {
            parallel {
                stage('Frontend: Lint & Test') {
                    steps {
                        dir('frontend') {
                            sh '''
                            echo "=== Linting & Testing Frontend ==="
                            npm install
                            npm run lint
                            npm run test
                            '''
                        }
                    }
                }
                stage('Backend: Lint & Test') {
                    steps {
                        dir('backend') {
                            sh '''
                            echo "=== Linting & Testing Backend ==="
                            
                            # Membuat dan mengaktifkan Python Virtual Environment
                            python3 -m venv venv
                            . venv/bin/activate
                            
                            # Install tools dan dependensi aman di dalam venv
                            pip install --upgrade pip
                            pip install flake8 pytest
                            if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
                            
                            # Eksekusi Linting
                            flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
                            
                            # Eksekusi Testing
                            pytest
                            '''
                        }
                    }
                }
            }
        }

        stage('Build & Scan Images') {
            parallel {
                stage('Build & Scan Backend') {
                    steps {
                        sh """
                        docker build \
                          -t ${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER} \
                          -t ${DOCKER_USER}/${IMAGE_BACKEND}:latest \
                          backend

                        trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER}
                        """
                    }
                }
                stage('Build & Scan Frontend') {
                    steps {
                        sh """
                        docker build \
                          -t ${DOCKER_USER}/${IMAGE_FRONTEND}:v${env.BUILD_NUMBER} \
                          -t ${DOCKER_USER}/${IMAGE_FRONTEND}:latest \
                          frontend

                        trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${IMAGE_FRONTEND}:v${env.BUILD_NUMBER}
                        """
                    }
                }
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_PASS'
                    )
                ]) {
                    sh """
                    echo \$DOCKERHUB_PASS | docker login -u \$DOCKERHUB_USER --password-stdin

                    # Push Backend
                    docker push ${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER}
                    docker push ${DOCKER_USER}/${IMAGE_BACKEND}:latest
                    
                    # Push Frontend
                    docker push ${DOCKER_USER}/${IMAGE_FRONTEND}:v${env.BUILD_NUMBER}
                    docker push ${DOCKER_USER}/${IMAGE_FRONTEND}:latest

                    docker logout
                    """
                }
            }
        }

        stage('K3s Deployment') {
            steps {
                withCredentials([
                    file(credentialsId: 'k3s-kubeconfig', variable: 'KUBECONFIG')
                ]) {
                    sh """
                    echo "=== Testing K3s Connection ==="
                    kubectl get nodes

                    echo "=== Deploying to K3s ==="
                    kubectl apply -f k8s/

                    # Update image secara dinamis menggunakan variabel Jenkins
                    kubectl set image deployment/backend backend=${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER}
                    kubectl set image deployment/frontend frontend=${DOCKER_USER}/${IMAGE_FRONTEND}:v${env.BUILD_NUMBER}

                    # Verifikasi status rollout
                    kubectl rollout status deployment/backend
                    kubectl rollout status deployment/frontend
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline Successfully Completed!'
        }
        failure {
            echo 'Pipeline Failed. Please check the logs.'
        }
        always {
            echo 'Cleaning up Docker images...'
            sh 'docker image prune -af || true'
        }
    }
}