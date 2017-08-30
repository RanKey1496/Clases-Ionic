angular.module('starter')
.factory('AuthenticationService', function($auth, $http, $state, $rootScope){
	function login(credentials, callback){
		$auth.login(credentials).then(function(){
			return $http.get('http://localhost:3000/api/authenticated');
		}, function(err){
            callback(err);
		}).then(function(res){
			if(res){
				var user = JSON.stringify(res.data.message);
				localStorage.setItem('user', user);
				$rootScope.authenticated = true;
				$rootScope.currentUser = res.data.message;
				callback(true);
			}
		})
	};

	function logout(){

	};

	return {
		login: login(),
		logout: logout
	}
})