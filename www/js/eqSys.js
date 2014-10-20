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
