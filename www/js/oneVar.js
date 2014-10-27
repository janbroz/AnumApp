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
    var x0 = parseFloat($scope.input.x0);
    var delta = parseFloat($scope.input.delta);
    var nIter = parseInt($scope.input.nIter);
    var fx0 = f.eval({
      x: x0
    });
    $scope.data.headers = ["X", "Y"];
    if (fx0 === 0) {
      $scope.data.root = x0;
    } else {
      var x1 = x0 + delta;
      var counter = 1;
      var fx1 = f.eval({
        x: x1
      });
      $scope.data.rows.push([format1(x0), format2(fx0)]);
      while ((fx0 * fx1 > 0) && (counter <= nIter)) {
        x0 = x1;
        fx0 = fx1;
        x1 = x0 + delta;
        fx1 = f.eval({
          x: x1
        });
        $scope.data.rows.push([format1(x0), format2(fx0)]);
        counter++;
      }
      $scope.data.rows.push([format1(x1), format2(fx1)]);
      if (fx1 === 0) {
        $scope.data.root = x1;
      } else {
        if (fx0 * fx1 < 0) {
          $scope.data.root = "(" + format1(x0) + ", " + format1(x1) + ")";
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
    $scope.methodName = "Incremental Search";
    $scope.helpText = "This method is used in order to find a range in which a root is found, what is done is to start at one end of the range and initial evaluate give a function intervalos increases. The result will be a range where this contained a root.";
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
    var xi = parseFloat($scope.input.xi);
    var xs = parseFloat($scope.input.xs);
    var tol = parseFloat($scope.input.tol);
    var nIter = parseInt($scope.input.nIter);
    var f = math.compile($scope.input.f);

    $scope.data = {};
    $scope.data.rows = [];

    var fxi = f.eval({
      x: xi
    });
    var fxs = f.eval({
      x: xs
    });
    if (fxi === 0) {
      $scope.data.root = xi;
    } else {
      if (fxs === 0) {
        $scope.data.root = xs;
      } else {
        if (fxi * fxs < 0) {
          var xm = (xi + xs) / 2;
          var fxm = f.eval({
            x: xm
          });
          var counter = 1;
          var error = tol + 1;
          $scope.data.headers = ["Xi", "Xs", "Xm", "f(Xm)", "Error"];
          $scope.data.rows.push([format1(xi), format1(xs), format1(xm), format2(fxm), format2(error)]);
          while ((error > tol) && (fxm != 0) && (counter < nIter)) {
            if (fxi * fxm < 0) {
              xs = xm;
              fxs = f.eval({
                x: xm
              });
            } else {
              xi = xm;
              fxi = f.eval({
                x: xm
              });
            }
            var xaux = xm;
            xm = (xi + xs) / 2;
            fxm = f.eval({
              x: xm
            });
            error = Math.abs(xm - xaux);
            counter++;
            $scope.data.rows.push([format1(xi), format1(xs), format1(xm), format2(fxm), format2(error)]);
          }
          if (fxm === 0) {
            $scope.data.root = xm;
          } else {
            if (error < tol) {
              $scope.data.root = format1(xm) + " is a root approximation with a tolerance of " + tol;
            } else {
              $scope.data.root = "failure after" + nIter + " iterations";
            }
          }
        } else {
          $scope.data.root = "invalid interval";
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
    $scope.methodName = "Bisection";
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

    var xi = parseFloat($scope.input.xi);
    var xs = parseFloat($scope.input.xs);
    var tol = parseFloat($scope.input.tol);
    var nIter = parseInt($scope.input.nIter);
    var f = math.compile($scope.input.f);

    var fxi = f.eval({
      x: xi
    });
    var fxs = f.eval({
      x: xs
    });
    if (fxi === 0) {
      $scope.data.root = xi;
    } else {
      if (fxs === 0) {
        $scope.data.root = xs;
      } else {
        if (fxi * fxs < 0) {
          var xm = xi - (fxi * (xs - xi) / (fxs - fxi));
          var fxm = f.eval({
            x: xm
          });
          var counter = 1;
          var error = tol + 1;
          $scope.data.headers = ["Xi", "Xs", "Xm", "f(Xm)", "Error"];
          $scope.data.rows.push([format1(xi), format1(xs), format1(xm), format2(fxm), format2(error)]);
          while ((error > tol) && (fxm != 0) && (counter < nIter)) {
            if (fxi * fxm < 0) {
              xs = xm;
              fxs = f.eval({
                x: xm
              });
            } else {
              xi = xm;
              fxi = f.eval({
                x: xm
              });
            }
            var xaux = xm;
            xm = xi - (fxi * (xs - xi) / (fxs - fxi));
            fxm = f.eval({
              x: xm
            });
            error = Math.abs(xm - xaux);
            counter++;
            $scope.data.rows.push([format1(xi), format1(xs), format1(xm), format2(fxm), format2(error)]);
          }
          if (fxm === 0) {
            $scope.data.root = xm;
          } else {
            if (error < tol) {
              $scope.data.root = format1(xm) + " is a root approximation with a tolerance of " + tol;
            } else {
              $scope.data.root = "failure after" + nIter + " iterations";
            }
          }
        } else {
          $scope.data.root = "invalid interval";
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
    $scope.methodName = "False Position";
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

    var x0 = parseFloat($scope.input.x0);
    var tol = parseFloat($scope.input.tol);
    var nIter = parseInt($scope.input.nIter);
    var f = math.compile($scope.input.f);
    var g = math.compile($scope.input.g);

    $scope.data = {};
    $scope.data.rows = [];

    var fx0 = f.eval({
      x: x0
    });
    var error = tol + 1;
    var count = 0;

    $scope.data.headers = ["Xn", "f(Xn)", "Error"];
    $scope.data.rows.push([format1(x0), format2(fx0), format2(error)]);

    while ((fx0 != 0) && (error > tol) && (count < nIter)) {
      var xn = g.eval({
        x: x0
      });
      fx0 = f.eval({
        x: xn
      });
      error = Math.abs(xn - x0);
      x0 = xn;
      count++;
      $scope.data.rows.push([format1(x0), format2(fx0), format2(error)]);
    }
    if (fx0 === 0) {
      $scope.data.root = x0;
    } else {
      if (error < tol) {
        $scope.data.root = "Root aproximation at " + format1(x0) + " with a tolerance of " + tol;
      } else {
        $scope.data.root = "Failure after " + nIter + " iterations.";
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
    $scope.methodName = "Fixed Point";
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

.controller('NewtontCtrl', function($scope, $ionicLoading, $ionicModal) {
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

    var x0 = parseFloat($scope.input.x0);
    var tol = parseFloat($scope.input.tol);
    var nIter = parseInt($scope.input.nIter);
    var f = math.compile($scope.input.f);
    var g = math.compile($scope.input.g);

    $scope.data = {};
    $scope.data.rows = [];

    var fx0 = f.eval({
      x: x0
    });
    var dfx0 = g.eval({
      x: x0
    });
    var error = tol + 1;
    var count = 0;

    $scope.data.headers = ["Xn", "f(Xn)", "f'(Xn)", "Error"];
    $scope.data.rows.push([format1(x0), format2(fx0), format2(dfx0), format2(error)]);

    while ((fx0 != 0) && (error > tol) && (dfx0 != 0) && (count < nIter)) {
      var xn = x0 - fx0 / dfx0;
      fx0 = f.eval({
        x: xn
      });
      dfx0 = g.eval({
        x: xn
      });
      error = Math.abs(xn - x0);
      x0 = xn;
      count++;
      $scope.data.rows.push([format1(x0), format2(fx0), format2(dfx0), format2(error)]);
    }
    if (fx0 === 0) {
      $scope.data.root = x0;
    } else {
      if (error < tol) {
        $scope.data.root = "Root approximation at " + format1(x0) + " with a tolerance of " + tol;
      } else {
        if (dfx0 === 0) {
          $scope.data.root = xn + " may be a multiple root.";
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
    $scope.methodName = "Newton";
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

    var x0 = parseFloat($scope.input.x0);
    var x1 = parseFloat($scope.input.x1);
    var nIter = parseInt($scope.input.nIter);
    var f = math.compile($scope.input.f);
    var tol = parseFloat($scope.input.tol);

    $scope.data = {};
    $scope.data.rows = [];

    var fx0 = f.eval({
      x: x0
    });

    if (fx0 === 0) {
      $scope.data.root = x0;
    } else {
      var fx1 = f.eval({
        x: x1
      });
      var count = 0;
      var error = tol + 1;
      var den = fx1 - fx0;

      $scope.data.headers = ["Xn", "f(Xn)", "Error"];
      $scope.data.rows.push([format1(x1), format2(fx1), format2(error)]);

      while ((error > tol) && (fx1 != 0) && (den != 0) && (count < nIter)) {
        var x2 = x1 - (fx1 * (x1 - x0) / den);
        error = Math.abs(x2 - x1);
        x0 = x1;
        fx0 = fx1;
        x1 = x2;
        fx1 = f.eval({
          x: x1
        });
        den = fx1 - fx0;
        count++;
        $scope.data.rows.push([format1(x1), format2(fx1), format2(error)]);
      }

      if (fx1 === 0) {
        $scope.data.root = x1;
      } else {
        if (error < tol) {
          $scope.data.root = "Root approximation at " + format1(x1) + " with a tolerance of " + tol;
        } else {
          if (den === 0) {
            $scope.data.root = "Posible multiple root";
          } else {
            $scope.data.root = "Failure after " + nIter + " iterations.";
          }
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
    $scope.methodName = "Secant";
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
    $scope.helpText = "texto ayuda";
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
