module.exports = {
  modelsPath: '/home/tony/Desktop/passport-demo/models',
  modelPathBuilder: function(model) {
    var modelPath = this.modelsPath + '/' + model;
    return require(modelPath);
  }
}
