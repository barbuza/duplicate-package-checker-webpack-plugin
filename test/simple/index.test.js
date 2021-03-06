var webpack = require('webpack');
var assert = require('assert');
var stripAnsi = require('strip-ansi');
var MakeConfig = require('./make.webpack.config');

describe('Simple dependency tree', function() {
  it('should output warnings', function(done) {
   let warning = "duplicate-package-checker:\n  <a>\n    1.0.0 ./~/a\n    2.0.0 ./~/b/~/a\n\n  <b>\n    1.0.0 ./~/b\n    2.0.0 ./~/c/~/d/~/b\n";

    webpack(MakeConfig(), function(err, stats) {
      assert.equal(stripAnsi(stats.compilation.warnings[0].message), warning);
      done();
    });
  });

  it('should output warnings in verbose', function(done) {
    let warning = "duplicate-package-checker:\n  <a>\n    1.0.0 ./~/a from ./entry.js\n    2.0.0 ./~/b/~/a from ./~/b/index.js\n\n  <b>\n    1.0.0 ./~/b from ./entry.js\n    2.0.0 ./~/c/~/d/~/b from ./~/c/~/d/index.js\n";

    webpack(MakeConfig({ verbose: true }), function(err, stats) {
      assert.equal(stripAnsi(stats.compilation.warnings[0].message), warning);
      done();
    });
  });

  it('should ignore', function(done) {
    let warning = "duplicate-package-checker:\n  <a>\n    1.0.0 ./~/a from ./entry.js\n    2.0.0 ./~/b/~/a from ./~/b/index.js\n";

    webpack(MakeConfig({ verbose: true, ignore: ['b'] }), function(err, stats) {
      assert.equal(stripAnsi(stats.compilation.warnings[0].message), warning);
      done();
    });
  });
});
