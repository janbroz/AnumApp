angular.module('CalcNA.pequat', ['ionic'])

.controller('PequaCtrl', function($scope, $state, $ionicPopup, $ionicModal){
  $scope.toggleGroup = function(group){
    if($scope.isGroupShown(group)){
      $scope.shownGroup = null;
    }else{
      $scope.shownGroup = group;
    }
  };

  $scope.isGroupShown = function(group){
    return $scope.shownGroup === group;
  };

})

.controller('PequInsertCtrl', function($scope, $state){
  $scope.peq = {};
  $scope.store = function(){
    localStorage.setItem("peq", $scope.peq.fx);
    $state.go('app.pequations');
  };
})

.controller('EulerCtrl', function($scope, $ionicLoading, $ionicModal){
  $scope.input = {};
  var f = localStorage.getItem("peq");
  if(f === "undefined" || f == null){
    $scope.input.fx = "";
  }else{
    $scope.input.fx = f;
  }

  $scope.calc = function(){
    var a = parseFloat($scope.input.vala);
    var ya = parseFloat($scope.input.valy);
    var delta = parseFloat($scope.input.delta);
    var f = math.compile($scope.input.fx);
    var n = parseFloat($scope.input.n);

    $scope.response = {};
    $scope.response.yval = [];

    $scope.response.yval.push([a, ya]);
    var tmp_n = a;
    var tmp_y = ya;

    for(var i=0; i<n; i++){
      fxy = parseFloat(f.eval({x: tmp_n, t: tmp_y}));
      tmp_n += delta;
      tmp_y = tmp_y + (delta*fxy);
      $scope.response.yval.push([tmp_n, tmp_y]);
    }

    var res = parseFloat(f.eval({x: a, t: 2}));

    console.log(res);
    $ionicModal.fromTemplateUrl('templates/pequations/result.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });    
  }
})

.controller('EulerModCtrl', function($scope, $ionicLoading, $ionicModal){
  $scope.input = {};
  var f = localStorage.getItem("peq");
  if(f === "undefined" || f == null){
    $scope.input.fx = "";
  }else{
    $scope.input.fx = f;
  }

  $scope.calc = function(){
    var a = parseFloat($scope.input.vala);
    var ya = parseFloat($scope.input.valy);
    var delta = parseFloat($scope.input.delta);
    var f = math.compile($scope.input.fx);
    var n = parseFloat($scope.input.n);

    $scope.response = {};
    $scope.response.yval = [];

    $scope.response.yval.push([a, ya]);
    var tmp_n = a;
    var tmp_y = ya;

    for(var i=0; i<n; i++){
      fxy = parseFloat(f.eval({x: tmp_n, t: tmp_y}));
      tmp_n += delta;
      tmp_y = tmp_y + (delta*fxy);
      $scope.response.yval.push([tmp_n, tmp_y]);
    }

    var res = parseFloat(f.eval({x: a, t: 2}));

    console.log(res);
    $ionicModal.fromTemplateUrl('templates/pequations/result.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });    
  }
});