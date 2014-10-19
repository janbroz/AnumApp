angular.module('CalcNA.controllers', ['ionic', 'CalcNA.oneVar'])

.controller('MenuController', function($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})
