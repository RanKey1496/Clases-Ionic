// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'satellizer'])

.config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide){

  function redirectWhenLoggedOut($q, $injector){
    return {
        responseError: function(rejection){
        var $state = $injector.get('$state');
        var rejectionReasons = ['Invalid token format', 'No Authorization header was found', 'Invalid token format', 'JsonWebTokenError', 'TokenExpiredError'];

        angular.forEach(rejectionReasons, function(value, key){
          if(rejection.data.message == value || rejection.data.message.name == value){
            localStorage.removeItem('user');
            $state.go('auth');
          }
        });

        return $q.reject(rejection);
      }
    }
  };

  $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);
  $httpProvider.interceptors.push('redirectWhenLoggedOut');

  $authProvider.loginUrl = 'http://localhost:3000/api/signin';
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('auth', {
      url: '/login',
      templateUrl: '../templates/login.html',
      controller: 'AuthController as login'
    })
    .state('search', {
      url: '/search',
      templateUrl: '../templates/search.html',
      controller: 'SearchController as search',
      authRequired: true
    })
    .state('home', {
      url: '/home',
      templateUrl: '../templates/home.html',
      controller: 'HomeController as home',
      authRequired: false
    });
})

.run(function($ionicPlatform, $rootScope, $state) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$stateChangeStart', function(event, toState){
    var user = JSON.parse(localStorage.getItem('user'));
    if(user){
      $rootScope.authenticated = true;
      $rootScope.currentUser = user;
      if(toState.name === "auth") {
        event.preventDefault();
        $state.go('search');
      }
    }
    if(toState.authRequired && !$rootScope.authenticated){
      event.preventDefault();
      $state.go('auth');
    }
  });
})
