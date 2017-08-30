angular.module('starter')
.controller("SignUpController", function($auth, $location){
	var vm = this;
    this.signup = function() {
        $auth.signup({
            email: vm.email,
            password: vm.password
        })
        .then(function() {
            // Si se ha registrado correctamente,
            // Podemos redirigirle a otra parte
            $location.path("/private");
        })
        .catch(function(err) {
            console.log(err);
        });
    }
})
.controller("LoginController", function($scope, $auth, $location, $ionicPopup){
    var vm = this;
    $scope.wrong = false;
    this.login = function(){
        $auth.login({
            email: vm.email,
            password: vm.password
        })
        .then(function(res){
        	if(!res.data.success){
        		$scope.wrong = true;
        	} else {
        		$scope.wrong = false;
        		$location.path("/private");
        	}            
        })
        .catch(function(err){
            console.log(err);
        });
    }
})
.controller("LogoutController", function($auth, $location){
    $auth.logout()
        .then(function(res) {
            $location.path("/login")
        });
})
.controller("HomeController", function($scope, $http){
	$scope.users = [];
	$http.get("http://localhost:3000/api/user")
		.success(function(data){
			angular.forEach(data, function(user){
	          $scope.users.push(user);
	        }); 
		});
})
.controller("PrivateController", function($auth, $scope, $http, $location){
	if(!$auth.isAuthenticated()){
		$location.path("/login");
	}

	$scope.success = false;
	$scope.show = false;

	$scope.search = function(){
		$scope.user = {};
		var base_url = 'http://localhost:3000/api/user/';
		var userId = $scope.search.id;
		var url = base_url.concat(userId);
		var params = {token: $auth.getToken()};
		$http.get('http://localhost:3000/api/user/'.concat($scope.search.id), {params})
			.success(function(data){
				$scope.user = data.user;
				if(!data.success){
					if(data.message === "Invalid token"){
						$location.path("/login");
					} else {
						$scope.success = true;
						$scope.show = false;
					}
				} else { 
					$scope.success = false;
					$scope.show = true;
				}
				console.log(data);
			})
			.error(function(err){
				console.log(err);
			});
	};

});