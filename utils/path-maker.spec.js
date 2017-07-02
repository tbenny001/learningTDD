var should = require('should');
var pathMaker = require('./path-maker.js');

describe('path-maker', function() {
  describe('#modelPathBuilder', function() {
    it('should return a valid path given a model name', function() {
      var model = 'User';
      should.doesNotThrow(pathMaker.modelPathBuilder(model));
    });
    it('should throw an error when given an invalid model name', function() {
      var nonModel = 'Blah';
      should.throws(function() {pathMaker.modelPathBuilder(nonModel)}, "Error: Cannot find module '/home/tony/Desktop/passport-demo/models/Blah'");
    });
    it('should return a model object with a modelName attribute that matches the model passed', function() {
      var model = 'User';
      var modelType = pathMaker.modelPathBuilder(model).modelName;
      should.equal(modelType, model);
    });
  });

});
