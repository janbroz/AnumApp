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
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'templates/home.html'
  })
  .state('oneVar', {
    url: '/oneVar',
    templateUrl: 'templates/oneVar.html'
  })
  .state('eqSys', {
    url: '/eqSys',
    templateUrl: 'templates/eqSys.html'
  })
  .state('interpolation', {
    url: '/interpolation',
    templateUrl: 'templates/interpolation.html'
  })
})

// .config(function($routeProvider, $locationProvider) {
//   $routeProvider
//     .when('/home' , {
//       controller: 'HomeController',
//       templateUrl: 'templates/home.html'
//     })
//     .when('/oneVar', {
//       controller: 'OneVarController',
//       templateUrl: 'templates/oneVar.html'
//     })
//     .when('/eqSys', {
//       controller: 'EqSysController',
//       templateUrl: 'templates/eqSys.html'
//     })
//     .when('/interpolation', {
//       controller: 'InterpolationController',
//       templateUrl: 'templates/interpolation.html'
//     })
//     .otherwise({ redirectTo: '/home' });
// })
