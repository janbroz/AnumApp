angular.module('CalcNA.eqSys', ['ionic'])

.controller('EqSysCtrl', function($scope, $state, $ionicPopup){
  $scope.showPopup = function() {
      $scope.data = {}
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="number" ng-model="data.matrixSize">',
        title: 'Enter matrix size',
        subTitle: 'NxN',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.matrixSize) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.matrixSize;
              }
            }
          },
        ]
      });
      myPopup.then(function(res) {
        localStorage.matrixSize = res;
        $state.go('app.insert2');
      });
     };
})

.controller('EqSysInsertCtrl', function($scope, $state){
  /* codigo pipe para leer matrices
  $scope.matrix = [];
  var matSize = parseInt(localStorage.matrixSize);
  for(var i=0; i<matSize; i++) {
    var row = [];
    for(var j=0; j<matSize; j++) {
      row.push({ value : 0});
    }
    $scope.matrix.push(row);
  }
  console.log($scope.matrix);
  $scope.showMatrix = function(){
    console.log($scope.matrix);
  };*/
  var size = parseInt(localStorage.matrixSize);
  var matrix = new Array(size);
  for(var i = 0 ; i < size ; i++){
    matrix[i] = new Array(size);
  }
  for(var i = 0 ; i < size; i++){
    for (var j = 0 ; j < size ; j++){
      matrix[i][j] = 0;
    }
  }
  console.log(matrix);
  $scope.matriz = matrix;
  $scope.showMatrix = function(){
    console.log($scope.matriz);
  }
})

.controller('GeSimpleCtrl', function($scope, $ionicLoading, $ionicModal){
})

.controller('GeSimplePartialCtrl', function($scope, $ionicLoading, $ionicModal){
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



