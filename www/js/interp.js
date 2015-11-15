angular.module('CalcNA.interp', ['ionic'])

.controller('InterpCtrl', function($scope, $state, $ionicPopup, $ionicModal){
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

  $scope.showPopup = function(){
    $scope.data = {}
    var myPopup = $ionicPopup.show({
      template: '<input type="number" ng-model="data.number_points">',
      title: 'How many points are you going to use?',
      subTitle: '#points',
      scope: $scope,
      buttons: [{
        text: 'Cancel',
	onTap: function(e){
	  return null;
	}
      },{
        text: '<b>Next</b>',
	type: 'button-dark',
	onTap: function(e){
	  if(!$scope.data.number_points){
	    e.preventDefault();
	  }else{
	    return $scope.data.number_points;
	  }
	}
      },]
    });
    myPopup.then(function(res){
      if(res != null){
        localStorage.number_points = res;
	$state.go('app.insertPoints');
      }
    });
  };

})

.controller('InterpInsertCtrl', function($scope, $state){
  var npoints = parseInt(localStorage.number_points);
  $scope.points = new Array(npoints);
  for(var i=0; i<npoints; i++){
    $scope.points[i] = new Array(2);
  }

  for(var i=0; i<npoints; i++){
   for(var j=0; j<2; j++){
     $scope.points[i][j]= i+j;
   }
  }
  
  $scope.store_p = function(){
    for(var i=0; i<$scope.points.length; i++){
      for(var j=0; j<2; j++){
        localStorage.setItem("P" + i + j, $scope.points[i][j]);
      }
    }
    $state.go('app.interpolation');
  }

  $scope.idata = {};
  $scope.store = function(){
  };
})

.controller('EqSysMethCtrl', function($scope, $ionicLoading, $ionicModal){
  $scope.help = function(){
    $scope.methodName = "Equation systems method";
    $scope.helpText = "TODO - Help text";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }
})

.controller('PolyNewtonCtrl', function($scope, $ionicLoading, $ionicModal){
  $scope.input = {};
  $scope.calc = function(){
    var n = parseInt(localStorage.number_points);
    var points = getPoints(n);

    $scope.data = {};
    $scope.data.bs = [];
    $scope.data.px = [];
    $scope.data.poly = "";

    for(var i=2; i<n+1; i++){
      var lower = 0;
      for(var j=(i-1); j<n; j++){
        sup = points[j-1][i-1]-points[j][i-1];
	inf = points[lower][0]-points[j][0];
        result = sup/inf;
	points[j][i] = result;
	lower++;
      }
    }
    for(var i=0; i<n; i++){
      $scope.data.bs.push(points[i][i+1]);
    }
    for(var i=0; i<n; i++){
      if(i==0){
        $scope.data.px.push($scope.data.bs[0]);
      }else{
        var comp=[];
	for(var j=0; j<i; j++){
	  comp.push("(x-"+points[j][0]+")");
        }
	$scope.data.px.push(comp);
      }
    }
    var poly = "p(x) = ";
    for(var i=0; i<n; i++){
      if(i==0){
        poly += $scope.data.px[0];
      }else{
        poly += " + " + $scope.data.bs[i] + "*" + $scope.data.px[i].join("");
      }
      $scope.data.poly = poly;
    }
    
    console.log(points);

    $ionicModal.fromTemplateUrl('templates/interp/result.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });
  }

  $scope.help = function(){
    $scope.methodName = "Polinomio interpolante de newton";
    $scope.helpText = "Que hace el polinomio interpolante de newton";
    $ionicModal.fromTemplateUrl('templates/help.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });
  }
})

.controller('PolyNewtonDifCtrl', function($scope, $ionicLoading, $ionicModal){

  $scope.calc = function(){
    var n = parseInt(localStorage.number_points);
    var points = getPoints(n);

    $scope.data = {};
    $scope.data.ys = [];
    $scope.data.ls = [];
    $scope.data.poly = "p(x) = y0*l0 + y1*l1";

    $ionicModal.fromTemplateUrl('templates/interp/result.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });
  }

  $scope.help = function(){
    $scope.methodName = "Polinomio interpolante de newton con diferencias";
    $scope.helpText = "Que hace el polinomio interpolante de newton";
    $ionicModal.fromTemplateUrl('templates/help.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });
  }
})

.controller('PLagrangeCtrl', function($scope, $ionicLoading, $ionicModal){


  $scope.calc = function(){

    var n = parseInt(localStorage.number_points);
    var points = getPoints(n);

    $scope.data = {};
    $scope.data.ys = [];
    $scope.data.xs = [];
    $scope.data.ls = [];
    $scope.data.poly = "p(x) = ";
    console.log(points);

    for(var i=0; i<n; i++){
      $scope.data.ys.push(points[i][1]);
      $scope.data.xs.push(points[i][0]);
    }
    console.log($scope.data.xs);
    console.log(n);
    for(var i=0; i<n; i++){
      var li = [];
      for(var j=0;j<n; j++){
        if(j != i){
	  var bla = "(x-" + $scope.data.xs[j] + ")/(" +
	            ($scope.data.xs[i] - $scope.data.xs[j]) + ")";
          console.log("x0:" + $scope.data.xs[i] + "xi:" + $scope.data.xs[j] + " j:"+j);
	  li.push(bla);
	}
      }
      $scope.data.poly += " + " + $scope.data.ys[i] + "*" + li.join("");
    }

    for(var i=0; i<n; i++){
      $scope.data.ls.push("L"+i);
    }



    $ionicModal.fromTemplateUrl('templates/interp/result.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });
  }

  $scope.help = function(){
    $scope.methodName = "Polinomio de lagrange";
    $scope.helpText = "Que hace el polinomio de lagrange";
    $ionicModal.fromTemplateUrl('templates/help.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });
  }
});

function getPoints(n){
  var points = [];
  for(var i=0; i<n; i++){
    var row = [];
    for(var j=0; j<(n+1); j++){
      value = parseFloat(localStorage.getItem("P"+i+j));
      if(value){
        row.push(value);
      }else{
        row.push(0.0);
      }
    }
    points.push(row)
  }
  return points;
}


 