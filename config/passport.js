
// Import Passport, strategy, and config,u user models
const passport = require('passport'),  
      User = require('../models/user'),
      config = require('./main'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };  

// Setting local login strategy
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {  
  User.findOne({ email: email }, function(err, user) {
    if(err) { return done(err); }
    if(!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false, { error: "Your login details could not be verified. Please try again." }); }
      //req.session.cookie.user = req.user;
      return done(null, user);
    });
  });
});

//Setting local admin login strategy

const LoginAdmin = new LocalStrategy(localOptions, function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
        if(err) { return done(err); }
        if(!user) {
            return done(null, false,
                {error: 'Your login details could not be verified. Please try again.'});
        }else{
          if (user.role === 'User') {
            return done (null, false, {error: 'Your login details could not be verified. Please try again.'});
          }
        }
        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false, { error: "Your login details could not be verified. Please try again." }); }
            //req.session.user = req.user;
            return done(null, user);
        });
    });
});

const jwtOptions = {  
  // check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: config.secret
};

// Setting JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {  
  User.findById(payload._id, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);  
passport.use(localLogin);
passport.use(LoginAdmin);
