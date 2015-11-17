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


