properties([pipelineTriggers([githubPush()])])

pipeline {
  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timeout(time: 30, unit: 'MINUTES')
  }

  agent {
    kubernetes {
      label 'worker-apibuilder-js-generator'
      inheritFrom 'kaniko-slim'
    }
  }

  environment {
    ORG      = 'flowcommerce'
  }

  stages {
    stage('Checkout') {
      steps {
        checkoutWithTags scm

        script {
          VERSION = new flowSemver().calculateSemver() //requires checkout
        }
      }
    }

    stage('Commit SemVer tag') {
      when { branch 'main' }
      steps {
        script {
          new flowSemver().commitSemver(VERSION)
        }
      }
    }

    stage('Build and push docker image release') {
      when { branch 'main' }
      steps {
        container('kaniko') {
          script {
            semver = VERSION.printable()

            sh """
              /kaniko/executor -f `pwd`/Dockerfile -c `pwd` \
              --snapshot-mode=redo --use-new-run  \
              --destination ${env.ORG}/apibuilder-js-generator:$semver
            """ 
            
          }
        }
      }
    }

    stage('Display Helm Diff') {
      when {
        allOf {
          not { branch 'main' }
          changeRequest()
          expression {
            return changesCheck.hasChangesInDir('deploy')
          }
        }
      }
      steps {
        script {
          container('helm') {
            new helmDiff().diff('apibuilder-js-generator')
          }
        }
      }
    }

    stage('Deploy Helm chart') {
      when { branch 'main' }
      parallel {
        
        stage('deploy apibuilder-js-generator') {
          steps {
            script {
              container('helm') {
                new helmCommonDeploy().deploy('apibuilder-js-generator', 'apicollective', VERSION.printable(), 420)
              }
            }
          }
        }
        
      }
    }
  }
}
