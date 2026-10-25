// Ek hi Jenkinsfile har branch aur PR par chalti hai.
// `when { branch ... }` decide karta hai ki kaunsa stage chalega:
//
//   feature/* branch ya PR -> API test + Frontend test/build
//   dev mein merge         -> + Deploy to Staging   (http://localhost:3100)
//   main mein merge        -> + Senior approval + Deploy to Production (http://localhost:3200) + Git tag

pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Test') {
            // API aur Frontend ke tests ek saath (parallel) chalte hain, time bachta hai
            parallel {
                stage('API') {
                    steps {
                        dir('api') {
                            sh 'npm ci'
                            sh 'npm test'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                            sh 'npm test'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when { branch 'dev' }
            environment {
                APP_ENV     = 'staging'
                WEB_PORT    = '3100'
                APP_VERSION = "staging-${env.BUILD_NUMBER}"
            }
            steps {
                sh 'docker compose -p cicd-demo-staging -f deploy/docker-compose.yml up -d --build'
                sh 'sh deploy/smoke-test.sh http://host.docker.internal:3100 staging'
            }
        }

        stage('Approval for Production') {
            when { branch 'main' }
            steps {
                // Pipeline yahan rukti hai. Sirf senior (Jenkins user: sallu8400) Deploy dabaa sakta hai.
                timeout(time: 1, unit: 'HOURS') {
                    input message: 'Production par deploy karein?', ok: 'Deploy', submitter: 'sallu8400'
                }
            }
        }

        stage('Deploy to Production') {
            when { branch 'main' }
            environment {
                APP_ENV     = 'production'
                WEB_PORT    = '3200'
                APP_VERSION = "v1.0.${env.BUILD_NUMBER}"
            }
            steps {
                sh 'docker compose -p cicd-demo-prod -f deploy/docker-compose.yml up -d --build'
                sh 'sh deploy/smoke-test.sh http://host.docker.internal:3200 production'
            }
        }

        stage('Tag Release') {
            when { branch 'main' }
            steps {
                // Har production release ka Git tag, taaki rollback ke time pichla version mil sake
                withCredentials([usernamePassword(credentialsId: 'github-token',
                                                  usernameVariable: 'GH_USER',
                                                  passwordVariable: 'GH_TOKEN')]) {
                    sh '''
                        TAG="v1.0.${BUILD_NUMBER}"
                        git -c user.name=Jenkins -c user.email=jenkins@localhost tag -a "$TAG" -m "Production release $TAG"
                        git push "https://${GH_USER}:${GH_TOKEN}@${GIT_URL#https://}" "$TAG"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ ${env.BRANCH_NAME} #${env.BUILD_NUMBER} passed"
        }
        failure {
            echo "❌ ${env.BRANCH_NAME} #${env.BUILD_NUMBER} failed: ${env.BUILD_URL}"
        }
        always {
            cleanWs()
        }
    }
}
