pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
        sonarQubeScanner 'SonarScanner'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Environment') {
            steps {
                sh '''
                    echo "Node version:"
                    node --version

                    echo "npm version:"
                    npm --version

                    echo "Git commit:"
                    git rev-parse --short HEAD
                '''
            }
        }

        stage('Gateway Tests') {
            steps {
                dir('gateway') {
                    sh 'npm ci'
                    sh 'npm test -- --runInBand'
                }
            }
        }

        stage('Auth Service Tests') {
            steps {
                dir('services/auth-service') {
                    sh 'npm ci'
                    sh 'npm test -- --runInBand'
                }
            }
        }

        stage('Driver Service Tests') {
            steps {
                dir('services/driver-service') {
                    sh 'npm ci'
                    sh 'npm test -- --runInBand'
                }
            }
        }

        stage('Job Service Tests') {
            steps {
                dir('services/job-service') {
                    sh 'npm ci'
                    sh 'npm test -- --runInBand'
                }
            }
        }

        stage('Semgrep SAST') {
            steps {
                sh '''
                    set -eu

                    if ! command -v semgrep >/dev/null 2>&1; then
                        echo "Semgrep is not installed on this Jenkins agent."
                        echo "Install Semgrep or configure a dedicated scanner container."
                        exit 1
                    fi

                    semgrep scan \
                        --config p/javascript \
                        --config p/nodejs \
                        --error \
                        gateway/src \
                        services/auth-service/src \
                        services/driver-service/src \
                        services/job-service/src
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube-Local') {
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=f1-platform \
                            -Dsonar.projectName="F1 Platform" \
                            -Dsonar.sources=gateway/src,services/auth-service/src,services/driver-service/src,services/job-service/src \
                            -Dsonar.tests=gateway/tests,services/auth-service/tests,services/driver-service/tests,services/job-service/tests \
                            -Dsonar.test.inclusions=**/*.test.js,**/*.spec.js \
                            -Dsonar.exclusions=**/node_modules/**,**/coverage/**,**/dist/**,**/build/**
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'All tests and configured analysis stages passed.'
        }

        failure {
            echo 'Pipeline failed. Review the stage logs.'
        }

        always {
            echo 'CI pipeline execution finished.'
        }
    }
}