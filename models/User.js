var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = mongoose.model('User', new Schema({
  id: ObjectId,
  username: { type: String, unique: true},
  password: String,
  email: { type: String, unique: true}
}));

module.exports = User
