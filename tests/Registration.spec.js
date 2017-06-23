var should = require('should');
var request = require('supertest')
var app = require('../app')
var mongoose = require('mongoose')
var User = require('./../models/User')
var UsersController = require('./../controllers/users')

var setup = function() {
  mongoose.connect('mongodb://localhost/test')
}

var teardown = function() {
  mongoose.connection.db.dropDatabase()
  mongoose.disconnect()
}

describe('registration', function() {
  beforeEach(function() {
    setup()
  })

  afterEach(function() {
    teardown()
  })

  it('should create user if valid parameters are sent', function(done) {
    var params = {
      email: 'tbenny001@gmail.com',
      username: 'tony',
      password: 'password'
    }
    UsersController.register(params, function() {
      User.findOne({username: params.username}, function(err, user) {
        should.not.exist(err);
        should.exist(user);
        console.log("user found and his email is " + user.email)
        done();
      });
    })
  })
})
