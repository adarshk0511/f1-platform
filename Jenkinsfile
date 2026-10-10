pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 15, unit: 'MINUTES')
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
    }

    post {
        success {
            echo 'All F1 platform test suites passed.'
        }

        failure {
            echo 'Pipeline failed. Review the stage logs.'
        }

        always {
            echo 'CI pipeline execution finished.'
        }
    }
}