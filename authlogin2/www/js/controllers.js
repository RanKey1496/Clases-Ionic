angular.module('starter')
.controller('AuthController', function($auth, $http, $state, $rootScope){
	var vm = this;

	vm.loginError = false;
    vm.loginErrorText;

	vm.login = function(){
		var credentials = {
			email: vm.email,
			password: vm.password
		}

		$auth.login(credentials).then(function(){
			return $http.get('http://localhost:3000/api/authenticated');
		}, function(err){
			vm.loginError = true;
            vm.loginErrorText = err;
		}).then(function(res){
			if(res){
				var user = JSON.stringify(res.data.message);
				localStorage.setItem('user', user);
				$rootScope.authenticated = true;
				$rootScope.currentUser = res.data.message;
				$state.go('search');
			}
		})
	};
})

.controller('SearchController', function($http, $auth, $rootScope, $state){
	
	var vm = this;
	vm.user;
	vm.error;

	vm.getUser = function(){
		$http.get('http://localhost:3000/api/user/'.concat(vm.email))
			.success(function(user){
				vm.user = user;
			})
			.error(function(error){
				vm.error = error.message;
			});
	};

	vm.logout = function(){
		$auth.logout().then(function(){
			localStorage.removeItem('user');
			$rootScope.authenticated = false;
			$rootScope.currentUser = null;
			$state.go('auth');
		});
	}
})
.controller('HomeController', function($http, $state){
	var vm = this;
	vm.users;
	vm.error;

	initController();

	function initController(){
		$http.get('http://localhost:3000/api/user/')
			.success(function(users){
				vm.users = users;
			})
			.error(function(error){
				vm.error = error.message;
			});
	};

	vm.login = function(){
		$state.go('auth');
	}
});