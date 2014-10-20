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



