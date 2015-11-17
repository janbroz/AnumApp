angular.module('CalcNA.controllers', ['ionic', 'CalcNA.oneVar', 'CalcNA.eqSys', 'CalcNA.integr', 'CalcNA.interp', 'CalcNA.pequat'])

.controller('MenuController', function($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})
