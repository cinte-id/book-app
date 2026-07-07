pipeline {

    agent any

    environment {
        DOCKER_USER = "jodyys"
        IMAGE_BACKEND = "bookapp-backend"
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

        stage('Lint') {
            steps {
                sh '''
                echo "=== Linting Frontend (Node.js) ==="
                cd frontend
                npm install
                npm run lint

                echo "=== Linting Backend (Python) ==="
                cd ../backend
                python3 -m pip install --user flake8 --break-system-packages || pip install flake8 --break-system-packages
                export PATH="$HOME/.local/bin:$PATH"
                flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                echo "=== Skipping Frontend Test (No test script found) ==="

                echo "=== Testing Backend (Python) ==="
                cd backend

                python3 -m pip install --user --break-system-packages -r requirements.txt
                python3 -m pip install --user --break-system-packages pytest

                export PATH="$HOME/.local/bin:$PATH"

                if find . -name "test_*.py" -o -name "*_test.py" | grep -q .; then
                pytest
                else
                echo "No Python tests found. Skipping pytest."
                fi
            '''
    }
}

        stage('Build Image') {
            steps {
                sh """
                # Build Docker Image Backend
                docker build \
                -t ${DOCKER_USER}/${IMAGE_BACKEND}:v${BUILD_NUMBER} \
                -t ${DOCKER_USER}/${IMAGE_BACKEND}:latest \
                backend

                # Build Docker Image Frontend
                docker build \
                -t ${DOCKER_USER}/${IMAGE_FRONTEND}:v${BUILD_NUMBER} \
                -t ${DOCKER_USER}/${IMAGE_FRONTEND}:latest \
                frontend
                """
            }
        }

        stage('Security Scan Trivy') {
            steps {
                sh """
                trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${IMAGE_BACKEND}:v${BUILD_NUMBER}
                trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${IMAGE_FRONTEND}:v${BUILD_NUMBER}
                """
            }
        }

        stage('Push Images To DockerHub') {
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
                    docker push ${DOCKER_USER}/${IMAGE_BACKEND}:v${BUILD_NUMBER}
                    docker push ${DOCKER_USER}/${IMAGE_BACKEND}:latest
                    
                    # Push Frontend
                    docker push ${DOCKER_USER}/${IMAGE_FRONTEND}:v${BUILD_NUMBER}
                    docker push ${DOCKER_USER}/${IMAGE_FRONTEND}:latest

                    docker logout
                    """
                }
            }
        }

        stage('Test K3s Connection') {
            steps {
                withCredentials([
                    file(credentialsId: 'k3s-kubeconfig', variable: 'KUBECONFIG')
                ]) {
                    sh 'kubectl get nodes'
                }
            }
        }

        stage('Deploy K3s') {
            steps {
                withCredentials([
                    file(credentialsId: 'k3s-kubeconfig', variable: 'KUBECONFIG')
                ]) {
                    sh """
                    # 1. Terapkan manifes dasar dari folder k8s/
                    kubectl apply -f k8s/

                    # 2. Update image secara dinamis menggunakan variabel Jenkins (ditambahkan prefix 'v')
                    kubectl set image deployment/backend backend=jodyys/bookapp-backend:v${BUILD_NUMBER}
                    kubectl set image deployment/frontend frontend=jodyys/bookapp-frontend:v${BUILD_NUMBER}

                    # 3. Verifikasi status deployment sesuai target nama di atas
                    kubectl rollout status deployment/backend
                    kubectl rollout status deployment/frontend
                    """
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline Success'
        }
        failure {
            echo 'Pipeline Failed'
        }
        always {
            sh 'docker image prune -af || true'
        }
    }
}