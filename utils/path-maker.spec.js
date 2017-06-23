var should = require('should');

describe('path-maker', function() {
  describe('#modelsPathBuilder', function() {
    it('should return an valid path given a model name', function() {
      var modelName = 'User';
      modelsPathBuilder().should.doesNotThrow();
    });
  });

});
