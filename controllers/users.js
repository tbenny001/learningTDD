var bcrypt = require('bcryptjs');
var User = require('../models/User');

module.exports = {
  register: function(params, done) {

    //var hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    var newUser = new User({
      username: params.username,
      // password: hashedPassword,
      email: params.email
    });

    newUser.save(done);
  }
}
