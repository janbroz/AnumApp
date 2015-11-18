angular.module('CalcNA.integr', ['ionic'])

.controller('IntegrCtrl', function($scope, $state, $ionicPopup, $ionicModal){
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

.controller('IntegrInsertCtrl', function($scope, $state){
  $scope.eq = {};
  $scope.store = function(){
    localStorage.setItem("fx", $scope.eq.fx);
    $state.go('app.integration');
  };
})

.controller('SimpsonCtrl', function($scope, $ionicLoading, $ionicModal){
  $scope.input = {};

  var f = localStorage.getItem("fx");
  if(f === "undefined" || f == null){
    $scope.input.fx = "";
  }else{
    $scope.input.fx = f;
  }

  $scope.calc = function(){
    var a = parseFloat($scope.input.vala);
    var b = parseFloat($scope.input.valb);
    var cs = parseFloat($scope.input.cs);
    var f = math.compile($scope.input.fx);

    $scope.response = {};
    $scope.response.a = a;
    $scope.response.b = b;
    $scope.response.intg = [];
    $scope.response.deltas = [];

    var values = newValues([a,b]);
    var new_values = newValues(values[0]);
    var int_val = simpson_i(values[0], values[1],f);
    $scope.response.intg.push(int_val);
    $scope.response.deltas.push(values[1]);
    var int_val2 = simpson_i(new_values[0], new_values[1],f);
    $scope.response.intg.push(int_val2);
    $scope.response.deltas.push(new_values[1]);

    while(Math.abs(int_val-int_val2) > cs){
      values = newValues(new_values[0]);
      new_values = newValues(values[0]);
      var int_val = simpson_i(values[0], values[1],f);
      $scope.response.intg.push(int_val);
      $scope.response.deltas.push(values[1]);      
      var int_val2 = simpson_i(new_values[0], new_values[1],f);
      $scope.response.intg.push(int_val2);
      $scope.response.deltas.push(new_values[1]);      
    }

    $ionicModal.fromTemplateUrl('templates/integration/result.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });
  }

  $scope.help = function(){
    $scope.methodName = "Simpson 1/3";
    $scope.helpText = "TODO - Info about simpson";

    $ionicModal.fromTemplateUrl('templates/help.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });
  }
})

.controller('TrapCtrl', function($scope, $ionicLoading, $ionicModal){
  $scope.input = {};
  var f = localStorage.getItem("fx");
  if(f === "undefined" || f == null){
    $scope.input.fx = "";
  }else{
    $scope.input.fx = f;
  }

  $scope.calc = function(){
    var a = parseFloat($scope.input.vala);
    var b = parseFloat($scope.input.valb);
    var cs = parseFloat($scope.input.cs);
    var f = math.compile($scope.input.fx);
    $scope.response = {};
    $scope.response.a = a;
    $scope.response.b = b;
    $scope.response.intg = [];
    $scope.response.deltas = [];

    var values = newValues([a,b]);
    var n_values = newValues(values[0]);
    var int_val = trapezoid_i(values[0], values[1],f);
    $scope.response.intg.push(int_val);
    $scope.response.deltas.push(values[1]);
    var int_val2 = trapezoid_i(n_values[0], n_values[1],f);
    $scope.response.intg.push(int_val2);
    $scope.response.deltas.push(n_values[1]);

    while(Math.abs(int_val-int_val2) > cs){
      values = newValues(n_values[0]);
      n_values = newValues(values[0]);
      var int_val = trapezoid_i(values[0], values[1],f);
      $scope.response.intg.push(int_val);
      $scope.response.deltas.push(values[1]);
      var int_val2 = trapezoid_i(n_values[0], n_values[1],f);
      $scope.response.intg.push(int_val2);
      $scope.response.deltas.push(n_values[1]);

    }


    console.log("Almost there babe");
    $ionicModal.fromTemplateUrl('templates/integration/result.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });    
  }

  $scope.help = function(){
    $scope.methodName = "Trapezoid";
    $scope.helpText = "TODO - Info about the trapezoid method";

    $ionicModal.fromTemplateUrl('templates/help.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      modal.show();
    });
  }  

});



function newValues(array){
  var result = [];
  var l = array.length-1;
  var a = array[0];
  var b = array[l];
//  var n = Math.pow(2, l);
  var n = l*2;
  var delta = (array[array.length-1] - array[0]) / n;
  var value = a;

  while(value <= b){
    result.push(value);    
    value = value + delta;
  }
  return [result, delta];
}

function simpson_i(array, delta, f){
  

  var n_array = array.map(function(num){
    return parseFloat(f.eval({x: (num)}));
  });

  var m_array = [];
  var e_array = [];
  var o_array = [];
  var result = 0;
  for(var i=1; i<n_array.length-1; i++){
    m_array.push(n_array[i]);
  }
  for(var i=0; i<m_array.length; i++){
    if(i%2 == 0){
      o_array.push(m_array[i]);
    }else{
      e_array.push(m_array[i]);
    }
  }
  e_total = 2* tarray(e_array);
  o_total = 4* tarray(o_array);

  var a = parseFloat(n_array[0]);
  var c = parseFloat(n_array[n_array.length-1]);

  integral = (delta/3)*(a + e_total + o_total + c);

  result = integral;
  return result;
}

function tarray(array){
  var total = 0;
  for(i=0; i<array.length; i++){
    total += array[i];
  }
  return total;
}

function trapezoid_i(array, delta, f){
  var n_array = array.map(function(num){
    return parseFloat(f.eval({x: (num)}));
  });
  var m_array = [];
  for(var i=1; i<n_array.length-1; i++){
    m_array.push(n_array[i]);
  }
  var a = parseFloat(n_array[0]);
  var c = parseFloat(n_array[n_array.length-1]);

  var m_total = 2* tarray(m_array);
  integral = (delta/2) * (a + m_total +c);

  return integral;
}