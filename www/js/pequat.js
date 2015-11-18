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
    $scope.response.headers = [];

    $scope.response.yval.push([a, ya]);
    $scope.response.headers = ["n", "f(x,t)"];    
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
    $scope.response.headers = [];

    $scope.response.yval.push([a, ya]);
    $scope.response.headers = ["n", "f(x,t)"];
    var xi = a;
    var yi = ya;

    for(var i=0; i<n; i++){
      k1 = parseFloat(f.eval({x: xi, t: yi}));
      u = yi + (delta * k1);
      k2 = parseFloat(f.eval({x: (xi+delta), t: u}));
      yi = yi + (delta/2)*(k1+k2);
      xi += delta;
      $scope.response.yval.push([xi, yi]);
    }

    $ionicModal.fromTemplateUrl('templates/pequations/result.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });    
  }

  $scope.help = function(){
    $scope.methodName = "Euler";
    $scope.helpText = "TODO - Info about euler";

    $ionicModal.fromTemplateUrl('templates/help.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });
  }  
})

.controller('Rk4Ctrl', function($scope, $ionicLoading, $ionicModal){
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
    $scope.response.headers = [];

    $scope.response.yval.push([a, ya]);
    $scope.response.headers = ["n", "f(x,t)"];
    var xi = a;
    var yi = ya;

    for(var i=0; i<n; i++){
      k1 = parseFloat(f.eval({x: xi, t: yi}));
      k2 = parseFloat(f.eval({x: (xi+(delta/2)), t: (yi + (delta*k1/2))}));
      k3 = parseFloat(f.eval({x: (xi+(delta/2)), t: (yi + (delta*k2/2))}));
      k4 = parseFloat(f.eval({x: (xi+delta), t: (yi + (delta*k2))}));
      yi = yi + (delta/6*(k1+2*k2+2*k3+k4));
      xi += delta;
      $scope.response.yval.push([xi, yi]);
    }

    $ionicModal.fromTemplateUrl('templates/pequations/result.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });    
  }

  $scope.help = function(){
    $scope.methodName = "RK4";
    $scope.helpText = "TODO - Info about RK4";

    $ionicModal.fromTemplateUrl('templates/help.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });
  }  
});