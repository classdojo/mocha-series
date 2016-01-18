var async = require("async");

function bracketize (str) {
  return ["`", str, "`"].join("");
}

function series (only, seriesDescription, seriesRunner) {

  var queuedSteps = [];

  function runStep (pair, next) {
    var stepDescription = pair[0];
    var stepRunner = pair[1];

    function onFinish (err) {
      if (err) {
        err.message = [bracketize(seriesDescription), "step", bracketize(stepDescription), "failed with error", bracketize(err.message)].join(" ");
      }
      return next(err);
    }

    // function onUncaughtException (err) {
    //   process.removeListener("uncaughtException", onUncaughtException);
    //   return next(err);
    // }

    // Synchronous or promise step
    if (stepRunner.length === 0) {
      try {
        var ret = stepRunner();
        if (ret && ret.then) {
          ret.then(onFinish, onFinish);
        } else {
          onFinish();
        }
      } catch (err) {
        onFinish(err);
      }
    // Async step
    } else {
      try {
        // process.on("uncaughtException", onUncaughtException);
        stepRunner(onFinish);
        // process.removeListener("uncaughtException", onUncaughtException);
      } catch (err) {        
        onFinish(err);
      }
    }
  }

  function defineStep (stepDescription, stepRunner) {
    queuedSteps.push([stepDescription, stepRunner]);
  }

  var mochaFn = only ? it.only.bind(it) : it;

  if (!seriesRunner) {
    mochaFn(seriesDescription);
  } else {
    seriesRunner(defineStep);
    mochaFn(seriesDescription, function (done) {
      async.eachSeries(queuedSteps, runStep, done);
    });
  }
}

// Not using bind so we can keep context if someone's using it.
module.exports = function(seriesDescription, seriesRunner) {
  series(false, seriesDescription, seriesRunner);
};

module.exports.only = function(seriesDescription, seriesRunner) {
  series(true, seriesDescription, seriesRunner);
};

module.exports.skip = function(seriesDescription) {
  series(false, seriesDescription);
};

