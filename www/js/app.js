angular.module('CalcNA', [ 'ionic', 'CalcNA.controllers', 'ng'])

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
        templateUrl: 'templates/oneVar.html',
        controller: 'OneVarCtrl'
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
        templateUrl: 'templates/eqSys.html',
        controller:'EqSysCtrl'
      }
    }
  })
  .state('app.insert2', {
    url: '/insert2',
    views: {
      'menuContent' :{
        templateUrl: 'templates/eqSys/insert.html',
        controller:'EqSysInsertCtrl'
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
        templateUrl: 'templates/interpolation.html',
	controller: 'InterpCtrl'
      }
    }
  })
  .state('app.polynewton',{
    url: '/polynewton',
    views: {
      'menuContent':{
        templateUrl: 'templates/interp/polynewton.html',
	controller: 'PolyNewtonCtrl'
      }
    }
  })
  .state('app.polynewtondif',{
    url: '/polynewtondif',
    views: {
      'menuContent':{
        templateUrl: 'templates/interp/polynewtondif.html',
	controller: 'PolyNewtonDifCtrl'
      }
    }
  })
  .state('app.plagrange',{
    url: '/plagrange',
    views: {
      'menuContent':{
        templateUrl: 'templates/interp/plagrange.html',
	controller: 'PLagrangeCtrl'
      }
    }
  })
  .state('app.insertPoints', {
    url: '/insertPoints',
    views: {
      'menuContent' :{
        templateUrl: 'templates/interp/insert_points.html',
        controller:'InterpInsertCtrl'
      }
    }
  })
  .state('app.lspline', {
    url: '/lspline',
    views: {
      'menuContent' :{
        templateUrl: 'templates/interp/lspline.html',
        controller:'LSplineCtrl'
      }
    }
  })
  .state('app.cspline', {
    url: '/cspline',
    views: {
      'menuContent' :{
        templateUrl: 'templates/interp/cspline.html',
        controller:'CSplineCtrl'
      }
    }
  })
  .state('app.integration', {
    url: '/integration',
    views: {
      'menuContent' :{
        templateUrl: 'templates/integration.html',
	controller: 'IntegrCtrl'
      }
    }
  })
  .state('app.pequations', {
    url: '/pequations',
    views: {
      'menuContent' :{
        templateUrl: 'templates/pequations.html',
	controller: 'PequaCtrl'
      }
    }
  })
  
})

.directive('onReadFile', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
                
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						fn(scope, {$fileContent:onLoadEvent.target.result});
					});
				};

				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	};
});
