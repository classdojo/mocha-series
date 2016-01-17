var series = require(".");

describe("examples", function() {

  series("Pending series");

  series("This should pass", function(step) {

    step("Passing sync step", function() {

    });

    step("Passing async step", function(done) {
      setTimeout(done, 100);
    });

  });

  series("This should fail on its third step", function(step) {

    step("Passing sync step", function() {

    });

    step("Passing async step", function(done) {
      setTimeout(done, 100);
    });

    step("Failing sync step", function() {
      throw new Error("My error message");
    });

  });

  series("This should fail on its third step", function(step) {

    step("Passing sync step", function() {

    });

    step("Passing async step", function(done) {
      setTimeout(done, 100);
    });

    step("Async step yielding an error", function(done) {
      setTimeout(function() {
        return done(new Error("My error message"));
      }, 100)
    });

  });

  series("This should fail on its third step", function(step) {

    step("Passing sync step", function() {

    });

    step("Passing async step", function(done) {
      setTimeout(done, 100);
    });

    step("Async step throwing during sync portion", function(done) {
      throw new Error("My error message");
    });

  });

  series("This should fail on its third step", function(step) {

    step("Passing sync step", function() {

    });

    step("Passing async step", function(done) {
      setTimeout(done, 100);
    });

    step("Async step throwing during async portion", function(done) {
      setTimeout(function() {
        throw new Error("My error message");
      });
    });

  });


});