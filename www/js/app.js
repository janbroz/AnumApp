angular.module('CalcNA', ['ionic', 'CalcNA.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/app/home');

  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent' :{
        templateUrl: 'templates/home.html'
      }
    }
  })
  .state('app.oneVar', {
    url: '/oneVar',
    views: {
      'menuContent' :{
        templateUrl: 'templates/oneVar.html'
      }
    }
  })
  .state('app.eqSys', {
    url: '/eqSys',
    views: {
      'menuContent' :{
        templateUrl: 'templates/eqSys.html'
      }
    }
  })
  .state('app.interpolation', {
    url: '/interpolation',
    views: {
      'menuContent' :{
        templateUrl: 'templates/interpolation.html'
      }
    }
  })
})
