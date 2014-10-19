angular.module('CalcNA.controllers', ['ionic'])

.controller('MenuController', function($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('OneVarInsertCtrl', function($scope, $state) {
  $scope.eq = {};
  $scope.store = function() {
    localStorage.setItem("f", $scope.eq.f);
    localStorage.setItem("ff", $scope.eq.ff);
    localStorage.setItem("fff", $scope.eq.fff);
    localStorage.setItem("g", $scope.eq.g);
    $state.go('app.oneVar');
  };
})
.controller('IncSearchtCtrl', function($scope, $ionicLoading, $ionicModal) {
  $scope.input = {};

  var f = localStorage.getItem("f");
  if (f === "undefined" || f == null) {
      $scope.input.f = "";
  } else {
      $scope.input.f = f;
  }

  $scope.data = {};
  $scope.data.rows = [];

  $scope.calc = function() {
    $ionicLoading.show({
        template: 'Loading...'
      });
    var f       = math.compile($scope.input.f);
    var x0      = parseFloat($scope.input.x0);
    var delta   = parseFloat($scope.input.delta);
    var nIter   = parseInt($scope.input.nIter);
    var fx0     = f.eval({x:x0});
    $scope.data.headers = ["X", "Y"];
    if(fx0 === 0) {
        $scope.data.root = x0;
    } else {
        var x1 = x0 + delta;
        var counter = 1;
        var fx1 = f.eval({x:x1});
        $scope.data.rows.push([x0, fx0]);
        while((fx0*fx1 > 0) && (counter <= nIter)) {
            x0 = x1;
            fx0 = fx1;
            x1 = x0 + delta;
            fx1 = f.eval({x:x1});
            $scope.data.rows.push([math.format(x0, {precision: 14}), fx0]);
            counter++;
        }
        $scope.data.rows.push([math.format(x1, {precision: 14}), fx1]);
        if(fx1 === 0){
            $scope.data.root = x1;
        } else {
            if(fx0*fx1 < 0) {
                $scope.data.root = "(" + math.format(x0, {precision: 14}) + ", " + math.format(x1, {precision: 14}) + ")";
            } else {
                $scope.data.root = "Failure after " + nIter + " iterations.";
            }
        }
    }
    $ionicLoading.hide();
    $ionicModal.fromTemplateUrl('templates/oneVar/result.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

  $scope.back = function() {
    $scope.modal.hide();
  }
})
.controller('BisectionCtrl', function($scope, $ionicLoading) {

})
.controller('FalsePositionCtrl', function($scope, $ionicLoading) {

})
.controller('FixedPointCtrl', function($scope, $ionicLoading) {

})
.controller('NewtontCtrl', function($scope, $ionicLoading) {

})
.controller('SecantCtrl', function($scope, $ionicLoading) {

})
.controller('MultRootsCtrl', function($scope, $ionicLoading) {

})
