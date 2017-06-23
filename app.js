var express = require('express');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var mongoose = require('mongoose');
var User = require('./models/User');
var port = 1337;
var app = express();

var DB_ENVS = {production: 'auth', test: 'test', development: 'dev'}
var ENV_PORTS = {production: '1337', test: '1338', development: '1339'}
// read environmnet variable to determine environment
// env = ENV["environment"]
var env = process.env.NODE_ENV || 'development'
var port = ENV_PORTS[env]
mongoose.connect('mongodb://localhost/' + DB_ENVS[env]);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
  cookieName: 'session', //this will become the req.session object.
  secret: 'asdfqekrjghqod456y34y6fiuhp2345jk0234985n0i8u23n4098',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 30 * 1000
}));

app.get('/', function(req, res) {
  res.render('index', {
    title: 'Index',
    isAuthenticated: false,
    user: req.user
  });
});

// var route = function(method, url, controller, action) {
//   app[method](url, function(req, res) {
//     controller[action](req, res)
//   })
// }
//
// var get = function(url, controller, action) {
//   route('get', url, controller, action)
// }
//
// var post = function(url, controller, action) {
//   route('post', url, controller, action)
// }
//
// //get('/register', users, 'register')

app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  User.register()
})

app.get('/login', function(req, res) {
  res.render('login', {
    title: "Log In"
  });
});

app.post('/login', function(req, res) {
  User.findOne({ username: req.body.username }, function(err, user) {
    if(!user) {
      console.alert('Invalid username of password!');
      res.render('login', {
        title: 'Log In',
      });
    } else {
      if(bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        console.log(err);
        res.render('login', {
          title: 'Log In',
        });
      }
    }
  });
});

app.get('/dashboard', function(req, res) {
  if(req.session && req.session.user) {
    User.findOne({ username: req.session.user.username }, function(err, user) {
      if(!user) {
        req.session.reset();
        res.redirect('/login');
      } else {
        res.locals.user = user;
        res.render('dashboard', {
          title: 'Welcome to your dashboard!'
        });
      }
    })
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

module.exports = app.listen(port, function() {
  console.log('Server listening on port ' + port + '...');
});
