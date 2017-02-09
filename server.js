const express = require('express'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  Auth0Strategy = require('passport-auth0'),
  config = require('./config.js'),
  cors = require('cors'),
  request = require('request');

const app = express();


app.use(bodyParser.json());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'keyboardcat'
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('./public'));

var requireAuth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(403).end();
  }
  return next();
}

passport.use(new Auth0Strategy({
    domain: config.auth0.domain,
    clientID: config.auth0.clientID,
    clientSecret: config.auth0.clientSecret,
    callbackURL: '/auth/github/callback'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);

  }));

passport.serializeUser(function(user, done) {
  done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user);
})



app.get('/auth/github', passport.authenticate('auth0', {
  connection: 'github'
}));


//**************************//
//To force specific provider://
//**************************//
// app.get('/login/google',
//   passport.authenticate('auth0', {connection: 'google-oauth2'}), function (req, res) {
//   res.redirect("/");
// });

app.get('/auth/github/callback',
  passport.authenticate('auth0', {
    successRedirect: '/#/home'
  }),
  function(req, res) {
    res.status(200).send(req.user);
  })

app.get('/auth/me', function(req, res) {
  if (!req.user) return res.sendStatus(404);
  res.status(200).send(req.user);
})

app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})


app.get('/api/github/followers', requireAuth, function(req, res, next) {
  var options = {
    url: req.user._json.followers_url,
    headers: {
      'User-Agent': req.user._json.clientID
    }
  }
  request(options, function(err, response, body) {
    res.send(body);
  })
})

app.get('/api/github/:username/activity', requireAuth, function(req, res, next) {

  var options = {
    url: 'https://api.github.com/users/' + req.params.username + '/events',
    headers: {
      'User-Agent': req.user._json.clientID
    }
  }
  request(options, function(err, response, body) {
    res.send(body);
  })
})

app.listen(3000, function() {
  console.log('Connected on 3000')
})
