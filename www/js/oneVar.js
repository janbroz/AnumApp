angular.module('CalcNA.oneVar', ['ionic'])

.controller('OneVarCtrl', function($scope) {
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
      var f = math.compile($scope.input.f);
      var xa = parseFloat($scope.input.x0);
      var delta = parseFloat($scope.input.delta);
      var nIter = parseInt($scope.input.nIter);
      var fxa = f.eval({ x: xa });
      var n = 1;

      $scope.data.headers = ["a", "b"];
      var xb = xa + delta;
      var fxb = f.eval({ x: xb });

      while (n < nIter){
	  fxa = f.eval({ x: xa });
	  fxb = f.eval({ x: xb });
	  if(fxa*fxb < 0){
	      $scope.data.rows.push([xa, xb]);
	      xa = xb;
	      xb = xa+delta;
	  }
	  else if(fxa === 0){
	      $scope.data.root = xa;
	      xa = xb;
	      xb = xa + delta;
	  }
	  else{
	      xa = xb;
	      xb = xa + delta;
	  }
	  n++;
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

  $scope.help = function() {
    $scope.methodName = "Incremental Search";
    $scope.helpText = "We can use this algorithm as the base of the closed methods, because it will give us the sure interval in which at least one root is in.  When a continuous function is given, the root searching is defined by testing an initial value as the beginning of a loop, which is going to also tests every next number according to a differential value until a number of a given iterations is complete or when a root is found ( f(a) * f(b) < 0 ) .";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }
})

.controller('BisectionCtrl', function($scope, $ionicLoading, $ionicModal) {
  $scope.input = {};

  var f = localStorage.getItem("f");
  if (f === "undefined" || f === null) {
    $scope.input.f = "";
  } else {
    $scope.input.f = f;
  }

  $scope.calc = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
      var xa = parseFloat($scope.input.xi);
      var xb = parseFloat($scope.input.xs);
      var tol = parseFloat($scope.input.tol);
      var nIter = parseInt($scope.input.nIter);
      var f = math.compile($scope.input.f);
      var delta = parseFloat($scope.input.delta);  

      $scope.data = {};
      $scope.data.rows = [];
      $scope.data.headers = ["n", "x", "f(Xm)", "Error"];

      var fxa = f.eval({ x: xa });
      var fxb = f.eval({ x: xb });


      if(fxa === 0){
	  $scope.data.root = xa;
      }else if(fxb === 0){
	  $scope.data.root = xb;
      }else if(fxa*fxb < 0){
	  var c = (xa+xb)/2;
	  var fc = f.eval({ x: c });
	  var error = tol+1;
	  var n = 1;
	  var h = fxa;
	  $scope.data.rows.push([n, c, fc, error]);

	  while(error>tol && fc !== 0 && n < nIter && Math.abs(fc) > delta){
	      if(fxa*fc<0){
		  xb=c;
		  fxb = f.eval({ x: c });
	      }else{
		  xa=c;
		  fxa=f.eval({ x: c });
	      }
	      var xaux = c;
	      c = (xa+xb)/2;
	      fc = f.eval({ x: c });
	      error = Math.abs(c - xaux);
	      $scope.data.rows.push([n, c, fc, error]);
	      n++;
	  }
	  if(fc === 0){
	      $scope.data.root = c;
	  }else if(error < tol){
	      $scope.data.root = c;
	  }else{
	      $scope.data.root = "failure after" + nIter + " iterations";
	  }
      }else{
	  $scope.data.root = "The interval is invalid";
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

  $scope.help = function() {
    $scope.methodName = "Bisection";
    $scope.helpText = "Starting from a given closed interval and based on a number of iterations and a tolerance (related with the function error studied in chapter I), we repeatedly bisects by sub intervals the function's graphic trying to find an approximation of where the root could be. The number of iterations and the tolerance, determinate how many times we will repeat the loop and the new extreme points of the newer interval will be defined by the signs of the former values image; at the end if it was not possible to find a root, we say the method just failed.";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

})

.controller('FalsePositionCtrl', function($scope, $ionicLoading, $ionicModal) {
  $scope.input = {};
  var f = localStorage.getItem("f");
  if (f === "undefined" || f === null) {
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


      var xa = parseFloat($scope.input.xi);
      var xb = parseFloat($scope.input.xs);
      var tol = parseFloat($scope.input.tol);
      var nIter = parseInt($scope.input.nIter);
      var f = math.compile($scope.input.f);
      var delta = parseFloat($scope.input.delta);  

      $scope.data = {};
      $scope.data.rows = [];
      $scope.data.headers = ["n", "Xm", "f(Xm)", "Error"];

      var fxa = f.eval({ x: xa });
      var fxb = f.eval({ x: xb });


      if(fxa === 0){
	  $scope.data.root = xa+" is a root";
      }else if(fxb === 0){
	  $scope.data.root = xb+" is a root";
      }else if(fxa*fxb < 0){
	  var c = a - (fxa *(xb-xa)/(fxb-fxa));
	  var fc = f.eval({ x: c });
	  var error = tol+1;
	  var n = 1;	  
	  $scope.data.rows.push([n, c, fc, error]);

	  while(error>tol && n < nIter && Math.abs(fc) > delta){
	      if(fxa*fc<0){
		  xb=c;
		  fxb = f.eval({ x: c });
	      }else{
		  xa=c;
		  fxa=f.eval({ x: c });
	      }
	      var xaux = c;
	      c = a - (fxa *(xb-xa))/(fxb-fxa);
	      fc = f.eval({ x: c });
	      error = Math.abs(c - xaux);
	      $scope.data.rows.push([n, c, fc, error]);
	      n++;
	  }
	  if(fc === 0){
	      $scope.data.root = c;
	  }else if(error < tol){
	      $scope.data.root = c;
	  }else{
	      $scope.data.root = "failure after" + nIter + " iterations";
	  }
      }else{
	  $scope.data.root = "The interval is invalid";
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

  $scope.help = function() {
    $scope.methodName = "False Position";
    $scope.helpText = "TODO-- Detailed information about the fixed point method";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

})

.controller('FixedPointCtrl', function($scope, $ionicLoading, $ionicModal) {
  $scope.input = {};

  var f = localStorage.getItem("f");
  var g = localStorage.getItem("g");
  if (f === "undefined" || f === null) {
    $scope.input.f = "";
  } else {
    $scope.input.f = f;
  }
  if (g === "undefined" || g === null) {
    $scope.input.g = "";
  } else {
    $scope.input.g = g;
  }

  $scope.calc = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });

      var xa = parseFloat($scope.input.x0);
      var tol = parseFloat($scope.input.tol);
      var nIter = parseInt($scope.input.nIter);
      var f = math.compile($scope.input.f);
      var g = math.compile($scope.input.g);
      var delta = parseFloat($scope.input.delta);

      $scope.data = {};
      $scope.data.rows = [];

      $scope.data.headers = ["n", "x", "f(x)", "Error"];

      var fxa = f.eval({ x : xa });
      var n=0;
      var error=tol+1;
      
      while(fxa!==0 && error > tol && n<nIter && Math.abs(fxa) > delta){
	  var xb=g.eval({ x: xa});
	  fxa=f.eval({ x:xb });
	  error=Math.abs(xb-xa);
	  xa=xb;
	  n++;
	  $scope.data.rows.push([n, xa, fxa, error]);
      }

      if(fxa === 0){
	  $scope.data.root = xa+" is a root";
      }else if(error < tol){
	  $scope.data.root = xa+" is an aproximated root";
      }else{
	  $scope.data.root = "Failed after " + n + " iterations";
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

  $scope.help = function() {
    $scope.methodName = "Fixed Point";
    $scope.helpText = "TODO-- Detailed information about the fixed point method. ";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

})

.controller('NewtontCtrl', function($scope, $ionicLoading, $ionicModal) {
  $scope.input = {};

  var f = localStorage.getItem("f");
  var ff = localStorage.getItem("ff");
  if (f === "undefined" || f === null) {
    $scope.input.f = "";
  } else {
    $scope.input.f = f;
  }
  if (ff === "undefined" || ff === null) {
    $scope.input.ff = "";
  } else {
    $scope.input.ff = ff;
  }

  $scope.calc = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });

      var xa = parseFloat($scope.input.x0);
      var tol = parseFloat($scope.input.tol);
      var nIter = parseInt($scope.input.nIter);
      var f = math.compile($scope.input.f);
      var ff = math.compile($scope.input.ff);
      var delta = parseInt($scope.input.delta);
      
      $scope.data = {};
      $scope.data.rows = [];

      var fxa=f.eval({ x: xa });
      var dfx=ff.eval({ x: xa });
      var n=0;
      var error=tol+1;
      var xb=0;

      $scope.data.headers = ["n", "Xn", "f(Xn)", "Error"];
      
      while(error>tol && n<nIter && Math.abs(fxa) > delta){
	  xb=xa-(fxa/dfx);
	  fxa=f.eval({ x: xb });
	  dfx=ff.eval({ x: xb });
	  error=Math.abs(xb-xa);
	  xa=xb;
	  n++;
	  $scope.data.rows.push([n, xa, fxa, error]);
      }
      if(fxa === 0){
	  $scope.data.root=xa + " is a root";
      }else if(error<tol){
	  $scope.data.root=xb + " is an aprox root with tol: "+ tol;
      }else if(dfx===0){
	  $scope.data.root=xb + " is probably a multiple root";
      }else{
	  $scope.data.root="Method failed with " + n + " iterations";
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

  $scope.help = function() {
    $scope.methodName = "Newton";
    $scope.helpText = "TODO-- Detailed information about the newton method";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

})

.controller('SecantCtrl', function($scope, $ionicLoading, $ionicModal) {
  $scope.input = {};

  var f = localStorage.getItem("f");
  if (f === "undefined" || f === null) {
    $scope.input.f = "";
  } else {
    $scope.input.f = f;
  }

  $scope.calc = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });

      var xa = parseFloat($scope.input.x0);
      var xb = parseFloat($scope.input.x1);
      var nIter = parseInt($scope.input.nIter);
      var f = math.compile($scope.input.f);
      var tol = parseFloat($scope.input.tol);
      var delta=parseFloat($scope.input.delta);
      
      $scope.data = {};
      $scope.data.rows = [];

      var fxa=f.eval({ x: xa});
      if(fxa===0){
	  $scope.data.root=xa+" is a root";
      }else{
	  var fxb=f.eval({ x: xb});
	  var n=0;
	  var error=tol+1;
	  var den=fxa-fxb;
	  
	  $scope.data.headers = ["n", "Xn", "f(Xn)", "Error"];
	  $scope.data.rows.push([n, xb, fxb, error]);
	  while(error>tol && fxa!==0 && den!==0 && n<nIter && Math.abs(fxa) > delta){
	      var xc = xb-fxb*(xb-xa)/den;
	      error=Math.abs(xc-xb);
	      xa=xb;
	      fxa=fxb;
	      xb=xc;
	      fxb=f.eval({ x: xb});
	      den=fxb-fxa;
	      n++;
	      $scope.data.rows.push([n, xb, fxb, error]);
	  }
	  if(fxb===0){
	      $scope.data.root=xb+" is a root";
	  }else if(error<tol){
	      $scope.data.root=xb+" is an aprox root with a tol= "+tol;
	  }else if(den===0){
	      $scope.data.root="there are probably multiple roots";
	  }else{
	      $scope.data.root="The method failed after "+n+" iterations";
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

  $scope.help = function() {
    $scope.methodName = "Secant";
    $scope.helpText = "TODO-- Detailed information about the secant method";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

})

.controller('MultRootsCtrl', function($scope, $ionicLoading, $ionicModal) {
  $scope.input = {};

  var f = localStorage.getItem("f");
  var ff = localStorage.getItem("ff");
  var fff = localStorage.getItem("fff");
  if (f === "undefined" || f === null) {
    $scope.input.f = "";
  } else {
    $scope.input.f = f;
  }
  if (ff === "undefined" || ff === null) {
    $scope.input.ff = "";
  } else {
    $scope.input.ff = ff;
  }
  if (fff === "undefined" || fff === null) {
    $scope.input.fff = "";
  } else {
    $scope.input.fff = fff;
  }

  $scope.calc = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });

    var f = math.compile($scope.input.f);
    var f1 = math.compile($scope.input.ff);
    var f2 = math.compile($scope.input.fff);
    var x0 = parseFloat($scope.input.x0);
    var tol = parseFloat($scope.input.tol);
    var nIter = parseInt($scope.input.nIter);

    $scope.data = {};
    $scope.data.rows = [];

    var fx0 = f.eval({
      x: x0
    });
    var f1x0 = f1.eval({
      x: x0
    });
    var f2x0 = f2.eval({
      x: x0
    });

    var count = 0;
    var error = tol + 1;
    var den = (f1x0 * f1x0) - (fx0 * f2x0);

    $scope.data.headers = ["Xn", "f(Xn)", "f'(Xn)", "f''(Xn)", "Error"];
    $scope.data.rows.push([format1(x0), format2(fx0), format2(f1x0), format2(f2x0), format2(error)]);

    while ((error > tol) && (fx0 != 0) && (den != 0) && (count < nIter)) {
      var xn = x0 - ((fx0 * f1x0) / den);
      fx0 = f.eval({
        x: xn
      });
      f1x0 = f1.eval({
        x: xn
      });
      f2x0 = f2.eval({
        x: xn
      });
      error = Math.abs(xn - x0);
      x0 = xn;
      den = (f1x0 * f1x0) - (fx0 * f2x0);
      count++;
      $scope.data.rows.push([format1(x0), format2(fx0), format2(f1x0), format2(f2x0), format2(error)]);
    }
    if (fx0 === 0) {
      $scope.data.root = x0;
    } else {
      if (error < tol) {
        $scope.data.root = "Root approximation at " + format1(x0) + " with a tolerance of " + tol;
      } else {
        if (den === 0) {
          $scope.data.root = "Posible multiple root";
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

  $scope.help = function() {
    $scope.methodName = "Multiple roots";
    $scope.helpText = "One of the drawbacks of the Newton method is when the derivative of the function tends to zero when evaluated at x and hence the convergence slows down or even stopped if a division by zero is reached. Similarly happen with the secant method if the function is very flat and f (x) and f (x-1) are approximately equal. In order to give solution to this drawback of these methods were developed to determine multiple roots.Method PseudoCode";
    $ionicModal.fromTemplateUrl('templates/help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }
});

function format1(number) {
  return math.format(number,
    {
      precision: 20
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

function parseDelta(deltaValue){
  if(delta == null){
    return 0;
  }else{
    return delta;
  }
}