var express = require('express');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var mongoose = require('mongoose');

var port = 1337;
var app = express();

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = mongoose.model('User', new Schema({
  id: ObjectId,
  username: { type: String, unique: true},
  password: String,
  email: { type: String, unique: true}
}));
mongoose.connect('mongodb://localhost/auth');

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

app.get('/register', function(req, res) {
  res.render('register');
})

app.post('/register', function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  var newUser = new User({
    username: req.body.username,
    password: hashedPassword,
    email: req.body.emai
  });

  newUser.save(function(err) {
    if(err) {
      var error = "Error. Please try again."
      if(err.code === 11000) {
        var error = "That username/email is already taken. Please try again.";
        console.log(error);
      }
      console.log(error);
      res.render('register.ejs', {
        title: 'Sign up'
      });
    } else {
      res.redirect('dashboard');
    }
  });
});

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

app.listen(port, function() {
  console.log('Server listening on port ' + port + '...');
});
