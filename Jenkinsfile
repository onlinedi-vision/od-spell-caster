pipeline {
  agent any
  
  stages {
	  
	  stage('Docker Build') {
		  steps {
				sh 'docker compose build'
			}
	  }

		stage('Docker Kill') {
			steps {
				sh 'docker compose down --rmi \'all\'' 		  
			}
	  }

		stage('Docker Run') {
			steps {
				sh 'docker compose up -d'
			}
		}
  }
}
