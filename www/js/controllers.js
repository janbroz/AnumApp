angular.module('CalcNA.controllers', ['ionic', 'CalcNA.oneVar', 'CalcNA.eqSys'])

.controller('MenuController', function($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})
