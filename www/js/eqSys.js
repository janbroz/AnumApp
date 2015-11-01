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

.controller('EqSysCtrl', function($scope, $state, $ionicPopup, $ionicModal) {
  $scope.input = {};
  $scope.temp = {};


  $scope.okFile = function($fileContent){
    console.log ("The file was updated fine");
    $scope.temp = $fileContent;
  };

  $scope.inputMatrix = function(){
    $scope.data = {}
    var matrixPopup = $ionicPopup.show({
      template: '<input type="file" on-read-file="okFile($fileContent)">',
      title: 'Enter the file of the matrix',
      subtitle: 'path to the file',
      scope: $scope,
      buttons: [{
        text: 'Cancel',
	onTap: function(e){
	  return null;
	}
      },{
        text: '<b>Accept</b>',
	type: 'button-dark',
	onTap: function(e){
	  $scope.data.matrixFile = ($scope.temp).replace(/(\r\n|\n|\r)/gm,",");;
	  if(!$scope.data.matrixFile){
	    console.log("There is no data in the file");
	    console.log($scope.data.matrixFile);
	    e.preventDefault();
	  } else{
	    return $scope.data.matrixFile;
	  }
	}
      }, ]
    });
    matrixPopup.then(function(res){
      if(res != null){
        localStorage.matrixFile = res;
	
	console.log("from storage: " + localStorage.matrixFile);
	$scope.someVal = localStorage.matrixFile.split(",");
	localStorage.matrixSize = Math.floor(Math.sqrt($scope.someVal.length));
	$state.go('app.insert2');

      }else{
        console.log("You monster!");
      }
    });
  };


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
  if(localStorage.matrixSize) $scope.b = getVector();
  $ionicModal.fromTemplateUrl('templates/eqSys/gsModal.html',
  function($ionicModal) {
        $scope.modalGS = $ionicModal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  $ionicModal.fromTemplateUrl('templates/eqSys/jacobiModal.html',
  function($ionicModal) {
        $scope.modalJacobi = $ionicModal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  $scope.goto = function(i) {
    var params = {
      iterations: $scope.input.iterations,
      tolerance: $scope.input.tolerance,
      xi: $scope.input.xi
    }
    localStorage.params = JSON.stringify(params);
    switch (i) {
      case 0:
        $scope.modalGS.hide();
        $state.go('app.gaussSeidel');
        break;
      case 1:
        $scope.modalJacobi.hide();
        $state.go('app.jacobi');
        break;
      default:
        break;
    }
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
  $scope.ml = localStorage.matrixFile.split(",");
  var eqPos = 0;
  var modl = size;

  for (var i = 0; i < size; i++) {
    $scope.vector[i] = parseInt($scope.ml[size*(i+1)+i]);
    for (var j = 0; j < size; j++) {
      if(eqPos % modl === 0 && eqPos !== 0){
	console.log("it:" + i + " " + modl);
        eqPos++;
	modl = (i+1)*size+(i);
	console.log("it:" + i + " " + modl);
      }
      $scope.valAt = parseFloat($scope.ml[eqPos]);
      $scope.matrix[i][j] = $scope.valAt;
      eqPos++;
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
  var size=parseInt(localStorage.matrixSize);
  var matrix=getMat(size);
  $scope.etapas=[];

  for(var k=0; k<size-1; k++){
    for(var i=k+1; i<size; i++){
      if(matrix[i][i]!=0){
        var mult=matrix[i][k]/matrix[k][k];
	for(var j=k; j<size+1; j++){
	  matrix[i][j]-=mult*matrix[k][j];
	}
      }else{
        alert("You should use other method because there is a 0 in the diagonal")
      }
    }
    $scope.etapas[k]=JSON.parse(JSON.stringify(matrix));
  }
  $scope.result = regresiveSustitution(matrix,size);

  $scope.help = function() {
    $scope.methodName = "Simple Gaussian Elimination";
    $scope.helpText = "Consists in generating the augmented matrix and then get a triangular upper matrix with elementary row operations; it has two phases: elimination of the unknowns and get the solution by back-substitution. The disadvantage of this method is that the rounding error is generated because the fractions are represented as decimal numbers, also it may occur a division by zero in the elimination phase. There are two cases where the Gaussian elimination without pivoting can be done: when the matrix is diagonally dominant and symmetric positive.";
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
    $scope.helpText = "Consists in selecting an item of the same column that is below the diagonal and has the biggest absolute value and reordering the rows on the matrix to get the max value of a coefficient on the main diagonal in order to reduce the effects of rounding errors. Partial pivoting is used because the rounding errors must be avoided; this should be obtained by converting the matrix A into a higher diagonal system. This row change is used to avoid problems such as division by zero";
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
    $scope.methodName = "Gaussian Elimination Total pivoting";
    $scope.helpText = "Rows and columns are exchanged to put the greatest numbers in the main diagonal; this change affects the order of the solutions. When the matrix is converted, the values of x can be found using back substitution.";
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

.controller('GeSimpleStepCtrl', function($scope, $ionicLoading, $ionicModal) {
  var n = parseInt(localStorage.matrixSize);
  var a = getMat(n);
  var mutiplicador = 0;
  $scope.etapas = [];
  for(var k=0; k<n-1; k++){
    a = pivoteoParcialEscalonado(a,n,k);
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
    $scope.methodName = "Gaussian Elimination Step pivoting";
    $scope.helpText = "texto ayuda";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }
})

.controller('CholeskyCtrl', function($scope, $ionicLoading, $ionicModal) {
  $scope.etapas = [];
  var n = parseInt(localStorage.matrixSize);
  var a = getMatrix();
  var result = cholesky(a);
  var L = result.l;
  var U = result.u;
  $scope.l = L;
  $scope.u = U;
  var b = getB(n);
  for(var i  = 0 ; i < L.length ; i++){
    L[i][n] = b[i];
  }

  var z = progresiveSustitutionArray(L , n);
  for(var i = 0 ; i <U.length ; i++){
    U[i][n] = z[i];
  }
  $scope.result = regresiveSustitution(U , n);
  for(var i  = 0 ; i < L.length ; i++){
    L[i].pop();
    U[i].pop();
  }

  $scope.help = function() {
    $scope.methodName = "Cholesky LU";
    $scope.helpText = "Exposes that the Uii elements of the U matrix are equal to the Lii elements of the L matrix. This method applies to the L*U factorization only. L is lower triangular with positive diagonal terms not necessarily unitary.";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

})

.controller('CroutCtrl', function($scope, $ionicLoading, $ionicModal) {
  var n = parseInt(localStorage.matrixSize);
  var a = getMatrix();
  var result = crout(a);
  var L = result.l;
  var U = result.u;
  $scope.l = L;
  $scope.u = U;
  var b = getB(n);

  for(var i  = 0 ; i < L.length ; i++){
    L[i][n] = b[i];
  }
  var z = progresiveSustitutionArray(L , n);
  for(var i = 0 ; i <U.length ; i++){
    U[i][n] = z[i];
  }
  $scope.result = regresiveSustitution(U , n);
  for(var i  = 0 ; i < L.length ; i++){
    L[i].pop();
    U[i].pop();
  }

  $scope.help = function() {
    $scope.methodName = "Crout LU";
    $scope.helpText = "Symmetric matrices. Exposes that the Uii elements of the U matrix are equal to 1. This method applies to the L*U factorization only. L is lower triangular. U is upper triangular with unit diagonal. This method finds a column of L and then a row of U, and assumes that the main diagonal of U is formed by 1.";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

})

.controller('DoolitleCtrl', function($scope, $ionicLoading, $ionicModal) {
  var n = parseInt(localStorage.matrixSize);
  var a = getMatrix();
  var result = doolittle(a);
  var L = result.l;
  var U = result.u;
  $scope.l = L;
  $scope.u = U;
  var b = getB(n);
  for(var i  = 0 ; i < L.length ; i++){
    L[i][n] = b[i];
  }
  var z = progresiveSustitutionArray(L , n);
  for(var i = 0 ; i <U.length ; i++){
    U[i][n] = z[i];
  }
  $scope.result = regresiveSustitution(U , n);
  for(var i  = 0 ; i < L.length ; i++){
    L[i].pop();
    U[i].pop();
  }

  $scope.help = function() {
    $scope.methodName = "Dolittle LU";
    $scope.helpText = "Regular matrices. Exposes that the Lii elements of the L matrix are equal to 1. This method applies to the L*U factorization only. L is lower triangular with unit diagonal. U is upper triangular. This method obtains the U elements by rows and the L elements by columns. It is necessary to calculate a row of U, then a column of L, until L and U are complete. Doolittle considers 1 on the main diagonal of L";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

})

.controller('GaussSeidelCtrl', function($scope, $ionicLoading, $ionicModal) {

  var n = parseInt(localStorage.matrixSize);
  var a = getMatrix();
  var b = getVector();
  var params = JSON.parse(localStorage.params);
  var niter = parseInt(params.iterations);
  var tol = params.tolerance;
  var x = [];
  for(var i in params.xi) {
    x.push(params.xi[i]);
  }
  var x1 = [];
  var itera = 0;
  for(var i = 0; i < x.length; i++){
      x1[i]=x[i];
  }
  var count = 0;
  var dispersion = tol + 1;
  $scope.headers = ["n"];
  for(var i in x) {
    i++;
    $scope.headers.push("x"+i);
  }
  $scope.headers.push("Norma");
  $scope.rows = [];
  row = [0];
  for(var i in x) {
    row.push(format1(x[i]));
  }
  row.push("-");
  $scope.rows.push(row);
  while(count < niter && tol<dispersion){
      for (var i = 0; i < n; i++){
          var suma = 0;
          for(var j = 0; j < n; j++){
              if(j!=i){
                  suma = suma + a[i][j]*x1[j];
              }
          }
          x1[i]= (b[i]-suma)/a[i][i];
      }
      var sumdisp = 0;
      for(var i = 0; i < x.length; i++){
          sumdisp = Math.abs(x1[i]-x[i]);
          x[i]=x1[i];
      }
      dispersion = sumdisp;
      row = [count+1];
      for(var i in x) {
        row.push(format1(x[i]));
      }
      row.push(format1(dispersion));
      $scope.rows.push(row);
      count ++;
  }
  $scope.result = x;

  $scope.help = function() {
    $scope.methodName = "Gauss Seidel";
    $scope.helpText = "Is a method that can be applied to any system of linear equations represented in a matrix of coefficients. In the Gauss-Seidel method, the improved values ​​are used as soon as they are obtained; the convergence of the method can be guaranteed if the matrix (A) is diagonally dominant or symmetrical.";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

})

.controller('JacobiCtrl', function($scope, $ionicLoading, $ionicModal) {
  var n = parseInt(localStorage.matrixSize);
  var a = getMatrix();
  var b = getVector();
  var params = JSON.parse(localStorage.params);
  var niter = parseInt(params.iterations);
  var tol = params.tolerance;
  var x = [];
  for(var i in params.xi) {
    x.push(params.xi[i]);
  }
  var n = a.length;
  var x1 = [];
  var dispersion = tol + 1;
  $scope.headers = ["n"];
  for(var i in x) {
    i++;
    $scope.headers.push("x"+i);
  }
  $scope.headers.push("Norma");
  $scope.rows = [];
  row = [0];
  for(var i in x) {
    row.push(format1(x[i]));
  }
  row.push("-");
  $scope.rows.push(row);
  for(var k = 0; k < niter && tol<dispersion; k++){
      for (var i = 0; i < n; i++){
          var suma = 0;
          for(var j = 0; j < n; j++){
              if(j!=i){
                  suma = suma + a[i][j]*x[j]
              }
          }
          x1[i]= (b[i]-suma)/a[i][i];
      }
      var sumdisp = 0;
      for(var i = 0; i < x.length; i++){
          sumdisp = Math.abs(x1[i]-x[i]);
          x[i]=x1[i];
      }
      dispersion = sumdisp;
      row = [k+1];
      for(var i in x) {
        row.push(format1(x[i]));
      }
      row.push(format1(dispersion));
      $scope.rows.push(row);
  }
  $scope.result = x;

  $scope.help = function() {
    $scope.methodName = "Jacobi";
    $scope.helpText = "It is based on an iterative formula, which starts with an initial value to generate a sequence that converges to X. This method needs a stop criterion that can be the difference between the Xn and Xn-1 approximations in absolute value or with the Euclidean norm. If A is strictly diagonally dominant, the Jacobi method converges for any initial value.";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

})

.controller('GaussSeidelRelaxCtrl', function($scope, $ionicLoading, $ionicModal) {

  function gaussSeidelRelajado(a,b,w,tol,x){
    var n = a.length;
    var x1 = [];
    var itera = 0;
    for(var i = 0; i < x.length; i++){
        x1[i]=x[i];
    }
    var dispersion = tol + 1;
    for(var k = 0; k < niter && tol<dispersion; k++){
        itera ++;
        for (var i = 0; i < n; i++){
            var suma = 0;
            for(var j = 0; j < n; j++){
                if(j!=i){
                    suma = suma + a[i][j]*x1[j];
                }
            }
            x1[i]= ((1-w)*x1[i])+ (w*(b[i]-suma)/a[i][i]);
        }
        var sumdisp = 0;
        for(var i = 0; i < x.length; i++){
            sumdisp = Math.abs(x1[i]-x[i]);
            x[i]=x1[i];
        }
        dispersion = sumdisp;
    }
    console.log(x);
    console.log(itera);
    console.log(dispersion);
}

  $scope.help = function() {
    $scope.methodName = "Gauss Seidel With Relax";
    $scope.helpText = "In the Gauss-Seidel method, the improved values ​​are used as soon as they are obtained; the convergence of the method can be guaranteed if the matrix (A) is diagonally dominant or symmetrical. This methods uses relaxing methods to get a better aproximation";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

});

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

function getB(n) {
  var row =[];
  for (var i = 0; i < n; i++) {
    row.push(parseFloat(localStorage.getItem("b" + i)));
  }
  return row;
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

function pivoteoParcialEscalonado(a, n, k){
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

function progresiveSustitution(Ab, n){
  var x= new Array(n);
  var result = "";
  x[0] = Ab[0][n] /Ab[0][0] ;
  for(var i = 1; i < n; i++){
      var sum = 0;
      for(var p = 0; p < i; p++){
          sum += Ab[i][p]*x[p];
      }
      x[i]= (Ab[i][n]-sum)/Ab[i][i];
  }
  for(var i=0; i<n; i++){
      result += "Z" + i + "= " + format1(x[i]) + " ";
  }
  return result;
}
function progresiveSustitutionArray(Ab, n){
  var x= new Array(n);
  x[0] = Ab[0][n] /Ab[0][0] ;
  for(var i = 1; i < n; i++){
      var sum = 0;
      for(var p = 0; p < i; p++){
          sum += Ab[i][p]*x[p];
      }
      x[i]= (Ab[i][n]-sum)/Ab[i][i];
  }
  return x;
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
      precision: 9
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

function cholesky(a){
    var l = [];
    var u =[];
    var n = a.length;
    for(var i = 0; i < a.length; i++){
        u[i]=[];
        l[i]=[];
        for(var j = 0; j < n; j++){
            l[i][j]=0;
            u[i][j]=0;
        }
    }
    for(var k = 0 ; k < n ; k++){
        var suma1 = 0;
        for(var p = 0 ; p <= k-1 ; p++){
            suma1 = suma1 + l[k][p] * u[p][k];
        }
        u[k][k] = l[k][k] = Math.sqrt(Math.abs(a[k][k] - suma1));
        if (suma1 > a[k][k]){
            l[k][k]*=-1;
        }
        for (var j = k + 1 ; j < n ; j++) {
            var suma3 = 0;
            for (var p = 0 ; p <= k-1 ; p++) {
                suma3 = suma3 + l[k][p]*u[p][j];
            }
            u[k][j] = (a[k][j] - suma3) / l[k][k];
        }
        for (var i = k + 1 ; i < n ; i++) {
            var suma2 = 0;
            for (var p = 0 ; p <= k-1 ; p++) {
                suma2 = suma2 + l[i][p]*u[p][k];
            }
            l[i][k] = (a[i][k] - suma2) / u[k][k];
        }
    }
    var LU={l:l,u:u}
    return LU;
}

function doolittle(a){
    var l = [];
    var u =[];
    var n = a.length;
    for(var i = 0; i < a.length; i++){
        u[i]=[];
        l[i]=[];
        for(var j = 0; j < n; j++){
            l[i][j]=0;
            u[i][j]=0;
        }
        l[i][i]=1;
    }
    for(var k = 0 ; k < n ; k++){
        var suma1 = 0;
        for(var p = 0 ; p <= k-1 ; p++){
            suma1 = suma1 + l[k][p] * u[p][k];
        }
        u[k][k] = a[k][k] - suma1;
        for (var i = k + 1 ; i < n ; i++) {
            var suma2 = 0;
            for (var p = 0 ; p <= k-1 ; p++) {
                suma2 = suma2 + l[i][p]*u[p][k];
            }
            l[i][k] = (a[i][k] - suma2) / u[k][k];
        }
        for (var j = k + 1 ; j < n ; j++) {
            var suma3 = 0;
            for (var p = 0 ; p <= k-1 ; p++) {
                suma3 = suma3 + l[k][p]*u[p][j];
            }
            u[k][j] = (a[k][j] - suma3) / l[k][k];
        }
    }
    var LU={l:l,u:u}
    return LU;
}

//method aproved!! :D
function crout(a){
    var l = [];
    var u =[];
    var n = a.length;
    for(var i = 0; i < a.length; i++){
        u[i]=[];
        l[i]=[];
        for(var j = 0; j < n; j++){
            l[i][j]=0;
            u[i][j]=0;
        }
        u[i][i]=1;
    }
    for(var k = 0 ; k < n ; k++){
        var suma1 = 0;
        for(var p = 0 ; p <= k-1 ; p++){
            suma1 = suma1 + l[k][p] * u[p][k];
        }
        l[k][k] = a[k][k] - suma1;
        for (var j = k + 1 ; j < n ; j++) {
            var suma3 = 0;
            for (var p = 0 ; p <= k-1 ; p++) {
                suma3 = suma3 + l[k][p]*u[p][j];
            }
            u[k][j] = (a[k][j] - suma3) / l[k][k];
        }
        for (var i = k + 1 ; i < n ; i++) {
            var suma2 = 0;
            for (var p = 0 ; p <= k-1 ; p++) {
                suma2 = suma2 + l[i][p]*u[p][k];
            }
            l[i][k] = (a[i][k] - suma2) / u[k][k];
        }
    }
    var LU = {l : l , u : u};
    return LU;
}
