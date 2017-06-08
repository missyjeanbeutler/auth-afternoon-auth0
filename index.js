const express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      passport = require('passport'),
      Auth0Strategy = require('passport-auth0')

const app = express(),
      port = 3007

app.use(bodyParser.json())
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.SESSION_SECRET
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new Auth0Strategy({

}))

app.listen(port, () => console.log(`listening on port ${port}`))