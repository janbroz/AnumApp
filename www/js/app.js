angular.module('CalcNA', ['ionic', 'CalcNA.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    math.config({number: 'bignumber'});
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
  .state('app.insert1', {
    url: '/insert1',
    views: {
      'menuContent' :{
        templateUrl: 'templates/oneVar/insert.html',
        controller: 'OneVarInsertCtrl'
      }
    }
  })
  .state('app.incSearch', {
    url: '/incSearch',
    views: {
      'menuContent' :{
        templateUrl: 'templates/oneVar/incSearch.html',
        controller: 'IncSearchtCtrl'
      }
    }
  })
  .state('app.bisection', {
    url: '/bisection',
    views: {
      'menuContent' :{
        templateUrl: 'templates/oneVar/bisection.html',
        controller: 'BisectionCtrl'
      }
    }
  })
  .state('app.falsePosition', {
    url: '/falsePosition',
    views: {
      'menuContent' :{
        templateUrl: 'templates/oneVar/falsePosition.html',
        controller: 'FalsePositionCtrl'
      }
    }
  })
  .state('app.fixedPoint', {
    url: '/fixedPoint',
    views: {
      'menuContent' :{
        templateUrl: 'templates/oneVar/fixedPoint.html',
        controller: 'FixedPointCtrl'
      }
    }
  })
  .state('app.newton', {
    url: '/newton',
    views: {
      'menuContent' :{
        templateUrl: 'templates/oneVar/newton.html',
        controller: 'NewtontCtrl'
      }
    }
  })
  .state('app.secant', {
    url: '/secant',
    views: {
      'menuContent' :{
        templateUrl: 'templates/oneVar/secant.html',
        controller: 'SecantCtrl'
      }
    }
  })
  .state('app.multRoots', {
    url: '/multRoots',
    views: {
      'menuContent' :{
        templateUrl: 'templates/oneVar/multRoots.html',
        controller: 'MultRootsCtrl'
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
  .state('app.geSimple', {
    url: '/geSimple',
    views: {
      'menuContent' :{
        templateUrl: 'templates/eqSys/geSimple.html',
        controller:'GeSimpleCtrl'
      }
    }
  })
  .state('app.geSimpleTotal',{
    url:'/geSimpleTotal',
    views: {
      'menuContent':{
        templateUrl:'templates/eqSys/geSimpleTotal.html',
        controller:'GeSimpleTotalCtrl'
      }
    }
  })
  .state('app.geSimplePartial',{
    url:'/geSimplePartial',
    views: {
      'menuContent':{
        templateUrl:'templates/eqSys/geSimplePartial.html',
        controller:'GeSimplePartialCtrl'
      }
    }
  })
  .state('app.geSimpleStep',{
    url:'/geSimpleStep',
    views: {
      'menuContent':{
        templateUrl:'templates/eqSys/geSimpleStep.html',
        controller:'GeSimpleStepCtrl'
      }
    }
  })
  .state('app.cholesky',{
    url:'/cholesky',
    views: {
      'menuContent':{
        templateUrl:'templates/eqSys/cholesky.html',
        controller:'CholeskyCtrl'
      }
    }
  })
  .state('app.crout',{
    url:'/crout',
    views: {
      'menuContent':{
        templateUrl:'templates/eqSys/crout.html',
        controller:'CroutCtrl'
      }
    }
  })
  .state('app.doolitle',{
    url:'/doolitle',
    views: {
      'menuContent':{
        templateUrl:'templates/eqSys/doolitle.html',
        controller:'DoolitleCtrl'
      }
    }
  })
  .state('app.gaussSeidel',{
    url:'/gaussSeidel',
    views: {
      'menuContent':{
        templateUrl:'templates/eqSys/gaussSeidel.html',
        controller:'GaussSeidelCtrl'
      }
    }
  })
  .state('app.jacobi',{
    url:'/jacobi',
    views: {
      'menuContent':{
        templateUrl:'templates/eqSys/jacobi.html',
        controller:'JacobiCtrl'
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
