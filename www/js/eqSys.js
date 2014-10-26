angular.module('CalcNA.eqSys', ['ionic'])

.controller('EqSysCtrl', function($scope, $state, $ionicPopup){
  $scope.input = {};
  $scope.showPopup = function() {
    $scope.data = {}
    var myPopup = $ionicPopup.show({
      template: '<input type="number" ng-model="data.matrixSize">',
      title: 'Enter matrix size',
      subTitle: 'NxN',
      scope: $scope,
      buttons: [
        { text: 'Cancel',
          onTap: function(e) {
            return null;
          }
        },
        {
          text: '<b>Next</b>',
          type: 'button-dark',
          onTap: function(e) {
            if (!$scope.data.matrixSize) {
              e.preventDefault();
            } else {
              return $scope.data.matrixSize;
            }
          }
        },
      ]
    });
    myPopup.then(function(res) {
      console.log(res);
      if(res != null) {
        localStorage.matrixSize = res;
        $state.go('app.insert2');
      }
    });
   };
  $scope.gePopup = function() {
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/eqSys/pivotingOptions.html',
      title: 'Choose type of pivoting',
      scope: $scope,
      buttons: [
        { text: 'Cancel',
          onTap: function(e) {
            return null;
          }
        },
        {
          text: '<b>Next</b>',
          type: 'button-dark',
          onTap: function(e) {
            if ($scope.input.pivotingType == undefined) {
              e.preventDefault();
            } else {
              return $scope.input.pivotingType;
            }
          }
        },
      ]
    });
    myPopup.then(function(res) {
      switch(res) {
        case 0:
          $state.go('app.geSimple');
          break;
        case 1:
          $state.go('app.geSimplePartial');
          break;
        case 2:
          $state.go('app.geSimpleTotal');
          break;
        case 3:
          $state.go('app.geSimpleStep');
          break;
        default:
          break;
      }
    });
  }
  $scope.luPopup = function() {
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/eqSys/luOptions.html',
      title: 'Choose type of LU Factorization',
      scope: $scope,
      buttons: [
        { text: 'Cancel',
          onTap: function(e) {
            return null;
          }
        },
        {
          text: '<b>Next</b>',
          type: 'button-dark',
          onTap: function(e) {
            if ($scope.input.luType == undefined) {
              e.preventDefault();
            } else {
              return $scope.input.luType;
            }
          }
        },
      ]
    });
    myPopup.then(function(res) {
      switch(res) {
        case 0:
          $state.go('app.cholesky');
          break;
        case 1:
          $state.go('app.crout');
          break;
        case 2:
          $state.go('app.doolitle');
          break;
        default:
          break;
      }
    });
  }
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
})

.controller('EqSysInsertCtrl', function($scope, $state){
  var size = parseInt(localStorage.matrixSize);
  $scope.matrix = new Array(size);
  $scope.vector = new Array(size);
  for(var i = 0 ; i < size ; i++){
    $scope.matrix[i] = new Array(size);
  }
  for(var i = 0 ; i < size; i++){
    $scope.vector[i] = 0;
    for (var j = 0 ; j < size ; j++){
      $scope.matrix[i][j] = 0;
    }
  }


  $scope.store = function(){
    for(var i=0; i<$scope.matrix.length; i++) {
      for(var j=0; j<$scope.matrix[0].length; j++) {
        localStorage.setItem("A"+i+j, $scope.matrix[i][j]);
      }
      localStorage.setItem("b"+i, $scope.vector[i]);
    }
    $state.go('app.eqSys');
  }
})

.controller('GeSimpleCtrl', function($scope, $ionicLoading, $ionicModal){
})

.controller('GeSimplePartialCtrl', function($scope, $ionicLoading, $ionicModal){
})

.controller('GeSimpleTotalCtrl', function($scope, $ionicLoading, $ionicModal){
})

.controller('GeSimpleStepCtrl', function($scope, $ionicLoading, $ionicModal){
})

.controller('CholeskyCtrl', function($scope, $ionicLoading, $ionicModal){
})

.controller('CroutCtrl', function($scope, $ionicLoading, $ionicModal){
})

.controller('DoolitleCtrl', function($scope, $ionicLoading, $ionicModal){
})

.controller('GaussSeidelCtrl', function($scope, $ionicLoading, $ionicModal){
})

.controller('JacobiCtrl', function($scope, $ionicLoading, $ionicModal){
})
