function getMatrix() {
  var size = parseInt(localStorage.matrixSize);
  var matrix = new Array(size);

  for (var i = 0; i < size; i++) {
    matrix[i] = new Array(size);
  }

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      matrix[i][j] = parseFloat(localStorage.getItem("A" + i + j));
    }
  }
  return matrix;
}

function getVector() {
  var size = parseInt(localStorage.matrixSize);
  var vector = new Array(size);
  for (var i = 0; i < size; i++) {
    vector[i] = parseFloat(localStorage.getItem("b" + i));
  }
  return vector;
}

angular.module('CalcNA.eqSys', ['ionic'])

.controller('EqSysCtrl', function($scope, $state, $ionicPopup) {
  $scope.input = {};
  $scope.showPopup = function() {
    $scope.data = {}
    var myPopup = $ionicPopup.show({
      template: '<input type="number" ng-model="data.matrixSize">',
      title: 'Enter matrix size',
      subTitle: 'NxN',
      scope: $scope,
      buttons: [{
        text: 'Cancel',
        onTap: function(e) {
          return null;
        }
      }, {
        text: '<b>Next</b>',
        type: 'button-dark',
        onTap: function(e) {
          if (!$scope.data.matrixSize) {
            e.preventDefault();
          } else {
            return $scope.data.matrixSize;
          }
        }
      }, ]
    });
    myPopup.then(function(res) {
      if (res != null) {
        localStorage.matrixSize = res;
        $state.go('app.insert2');
      }
    });
  };
  $scope.gePopup = function() {
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/eqSys/pivotingOptions.html',
      title: 'Choose type of pivoting',
      scope: $scope,
      buttons: [{
        text: 'Cancel',
        onTap: function(e) {
          return null;
        }
      }, {
        text: '<b>Next</b>',
        type: 'button-dark',
        onTap: function(e) {
          if ($scope.input.pivotingType == undefined) {
            e.preventDefault();
          } else {
            return $scope.input.pivotingType;
          }
        }
      }, ]
    });
    myPopup.then(function(res) {
      switch (res) {
        case 0:
          $state.go('app.geSimple');
          break;
        case 1:
          $state.go('app.geSimplePartial');
          break;
        case 2:
          $state.go('app.geSimpleTotal');
          break;
        case 3:
          $state.go('app.geSimpleStep');
          break;
        default:
          break;
      }
    });
  }
  $scope.luPopup = function() {
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/eqSys/luOptions.html',
      title: 'Choose type of LU Factorization',
      scope: $scope,
      buttons: [{
        text: 'Cancel',
        onTap: function(e) {
          return null;
        }
      }, {
        text: '<b>Next</b>',
        type: 'button-dark',
        onTap: function(e) {
          if ($scope.input.luType == undefined) {
            e.preventDefault();
          } else {
            return $scope.input.luType;
          }
        }
      }, ]
    });
    myPopup.then(function(res) {
      switch (res) {
        case 0:
          $state.go('app.cholesky');
          break;
        case 1:
          $state.go('app.crout');
          break;
        case 2:
          $state.go('app.doolitle');
          break;
        default:
          break;
      }
    });
  }
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
})

.controller('EqSysInsertCtrl', function($scope, $state) {
  var size = parseInt(localStorage.matrixSize);
  $scope.matrix = new Array(size);
  $scope.vector = new Array(size);
  for (var i = 0; i < size; i++) {
    $scope.matrix[i] = new Array(size);
  }
  for (var i = 0; i < size; i++) {
    $scope.vector[i] = 0;
    for (var j = 0; j < size; j++) {
      $scope.matrix[i][j] = 0;
    }
  }


  $scope.store = function() {
    for (var i = 0; i < $scope.matrix.length; i++) {
      for (var j = 0; j < $scope.matrix[0].length; j++) {
        localStorage.setItem("A" + i + j, $scope.matrix[i][j]);
      }
      localStorage.setItem("b" + i, $scope.vector[i]);
    }
    $state.go('app.eqSys');
  }
})

.controller('GeSimpleCtrl', function($scope, $ionicLoading, $ionicModal) {
  var n = parseInt(localStorage.matrixSize);
  var a = getMat(n);
  $scope.etapas = [];
  for (var k = 0; k < n-1 ; k++) {
    for (var i = k+1; i < n; i++) {
      if (a[i][i] != 0) {
        var mult = a[i][k] / a[k][k]
        for (var j = k; j < n+1; j++) {
          a[i][j] -= mult * a[k][j];
        }
      } else {
        alert("There's a zero in the diagonal, try another method.")
      }
    }
    // serializa y deserializa la matriz para un deep copy
    $scope.etapas[k] = JSON.parse(JSON.stringify(a));
  }
  $scope.result = regresiveSustitution(a,n);

  $scope.help = function() {
    $scope.methodName = "Simple Gaussian Elimination";
    $scope.helpText = "texto ayuda";
    $ionicModal.fromTemplateUrl('templates/help.html', {
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

.controller('GeSimplePartialCtrl', function($scope, $ionicLoading, $ionicModal) {

  var n = parseInt(localStorage.matrixSize);
  var a = getMat(n);
  var mutiplicador = 0;
  $scope.etapas = [];
  for(var k=0; k<n-1; k++){
    a = pivoteoParcial(a,n,k);
    for(var i=k+1; i<n; i++){
      multiplicador = a[i][k]/a[k][k];
      for(var j=k; j<n+1; j++){
        a[i][j] = a[i][j] - multiplicador * a[k][j];
      }
    }
    $scope.etapas[k] = JSON.parse(JSON.stringify(a));
  }
  $scope.result = regresiveSustitution(a,n);

  $scope.help = function() {
    $scope.methodName = "Gaussian Elimination Partial pivoting";
    $scope.helpText = "texto ayuda";
    $ionicModal.fromTemplateUrl('templates/help.html', {
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

.controller('GeSimpleTotalCtrl', function($scope, $ionicLoading, $ionicModal) {
  var n = parseInt(localStorage.matrixSize);
  var a = getMat(n);
  var mutiplicador = 0;
  $scope.etapas = [];
  for(var k=0; k<n-1; k++){
    a = pivoteoTotal(a,n,k);
    for(var i=k+1; i<n; i++){
      multiplicador = a[i][k]/a[k][k];
      for(var j=k; j<n+1; j++){
        a[i][j] = a[i][j] - multiplicador * a[k][j];
      }
    }
    $scope.etapas[k] = JSON.parse(JSON.stringify(a));
  }
  $scope.result = regresiveSustitution(a,n);

  $scope.help = function() {
    $scope.methodName = "Gaussian Elimination Partial pivoting";
    $scope.helpText = "texto ayuda";
    $ionicModal.fromTemplateUrl('templates/help.html', {
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

.controller('GeSimpleStepCtrl', function($scope, $ionicLoading, $ionicModal) {})

.controller('CholeskyCtrl', function($scope, $ionicLoading, $ionicModal) {})

.controller('CroutCtrl', function($scope, $ionicLoading, $ionicModal) {})

.controller('DoolitleCtrl', function($scope, $ionicLoading, $ionicModal) {})

.controller('GaussSeidelCtrl', function($scope, $ionicLoading, $ionicModal) {})

.controller('JacobiCtrl', function($scope, $ionicLoading, $ionicModal) {});

function getMat(n) {
  var mat = [];
  for (var i = 0; i < n; i++) {
    var row = [];
    for (var j = 0; j < n; j++) {
      row.push(parseFloat(localStorage.getItem("A" + i + j)));
    }
    row.push(parseFloat(localStorage.getItem("b" + i)));
    mat.push(row);
  }
  return mat;
}

function pivoteoParcial(a, n, k){
  var mayor = a[k][k];
  var filaMayor = k;
  for(var s=k+1; s < n ; s++){
    if(Math.abs(a[s][k]) > mayor){
      mayor = Math.abs(a[s][k]);
      filaMayor = s;
    }
  }
  if(mayor = 0){
    alert("Not unic solution");
  }else{
    if(filaMayor != k){
      a = intercambioFilas(a, filaMayor, k, n);
    }
    return a;
  }
}

function pivoteoTotal(a,n,k){
  var mayor = 0;
  filaMayor = k;
  columnaMayor = k;
  var marcas = [];
  for(var i = 0; i<n; i++){
    marcas[i] = i;
  }
  for(var r=k; r<n; r++){
    for(var s=k; s<n; s++){
      if(Math.abs(a[r][s]) > mayor){
        mayor = Math.abs(a[r][s]);
        filaMayor = r;
        columnaMayor = s;
      }
    }
  }
  if(mayor = 0){
    alert("Not unic solution");
  }else{
    if(filaMayor != k){
      a = intercambioFilas(a,filaMayor,k,n);
    }
    if(columnaMayor != k){
      a = intercambioColumnas(a, columnaMayor,k,n);
      marcas = intercambioMarcas(marcas, columnaMayor,k);
    }
    return a;
    //ACA NECESITAMOS RETORNAR MARCAR TAMBIEN
  }
}

function regresiveSustitution(Ab, n){
  var x = new Array(n);
  var result = "";
  x[n-1] = Ab[n-1][n] / Ab[n-1][n-1];
  for(var i = n-1 ; i >= 0; i--){
    var acum = 0;
    for(var p = i+1 ; p < n; p++ ){
      acum += Ab[i][p]*x[p];
    }
    x[i] = (Ab[i][n]-acum)/Ab[i][i];
  }
  for(var i=0; i<n; i++){
      result += "X" + i + "= " + format1(x[i]) + " ";
  }
  return result;
}

function intercambioFilas(a, filaMayor, k, n){
  for(var i=0;i<=n;i++){
    aux = a[k][i];
    a[k][i] = a[filaMayor][i];
    a[filaMayor][i] = aux;
  }
  return a;
}

function intercambioColumnas(a, columnaMayor, k, n){
  for(var i=0;i<n;i++){
    aux = a[i][k];
    a[i][k] = a[i][columnaMayor];
    a[i][columnaMayor] = aux;
  }
  return a;
}

function intercambioMarcas(marcas, columnaMayor,k){
  aux = marcas[k];
  marcas[k] = marcas[columnaMayor];
  marcas[columnaMayor] = aux;
  return marcas;
}

function format1(number) {
  return math.format(number,
    {
      precision: 6
    }
  );
}

function format2(number) {
  return math.format(number,
    {
      precision: 2,
      notation: 'exponential'
    }
  );
}
