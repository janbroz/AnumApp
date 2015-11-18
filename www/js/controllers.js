angular.module('CalcNA.controllers', ['ionic', 'CalcNA.oneVar', 'CalcNA.eqSys', 'CalcNA.interp', 'CalcNA.integr', 'CalcNA.pequat'])

.controller('MenuController', function($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})
