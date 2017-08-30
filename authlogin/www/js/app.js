// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'satellizer'])

.run(function($ionicPlatform) {
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
})

.config(function($authProvider, $stateProvider, $urlRouterProvider){
  $authProvider.loginUrl = "http://localhost:3000/api/signin";
  $authProvider.signupUrl = "http://localhost:3000/api/signup";
  $authProvider.tokenName = "token";
  $authProvider.tokenPrefix = "test";

  $stateProvider.
    state('home', {
      url: "/",
      templateUrl: "templates/home.html",
      controller: "HomeController"
    })
    .state("login", {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "LoginController",
        controllerAs: "login"
    })
    .state("signup", {
        url: "/signup",
        templateUrl: "templates/signup.html",
        controller: "SignUpController",
        controllerAs: "signup"
    })
    .state("logout", {
        url: "/logout",
        templateUrl: null,
        controller: "LogoutController"
    })
    .state("private", {
        url: "/private",
        templateUrl: "templates/private.html",
        controller: "PrivateController",
        controllerAs: "private"
    });
});