
// Import Passport, strategy, and config,u user models
const passport = require('passport'),  
      User = require('../models/user'),
      config = require('./main'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };

// module.exports = (passport) => {
//
//     passport.serializeUser(function (user, done) {
//         done(null, user.id);
//     });
//
//     passport.deserializeUser(function (id, done) {
//         User.findById(id, function (err, user) {
//             done(err, user);
//         });
//     });

// Setting local login strategy
    const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {error: 'Your login details could not be verified. Please try again.'});
            }

            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done(null, false, {error: "Your login details could not be verified. Please try again."});
                }
                //req.session.cookie.user = req.user;
                return done(null, user);
                console.log("===============", user);

            });
        });
    });

//Setting local admin login strategy

    const LoginAdmin = new LocalStrategy(localOptions, function (email, password, done) {
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err);
                console.log(err);
            }
            if (!user) {
                return done(null, false,
                    {error: 'Your login details could not be verified. Please try again.'});
                console.log(error);
            } else {
                if (user.role === 'User') {
                    return done(null, false, {error: 'Your login details could not be verified. Please try again.'});
                    console.log(error);
                }
            }
            user.comparePassword(password, function (err, isMatch) {

                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done(null, false, {error: "Your login details could not be verified. Please try again."});
                }
                //req.session.user = req.user;
                // passport.serializeUser( (user, done) => {
                //     var sessionUser = user;
                //     done(null, sessionUser)
                // });
                //
                // passport.deserializeUser( (sessionUser, done) => {
                //     done(null, sessionUser)
                // });
                return done(null, user);
                console.log("-------------------", user);
                console.log(error);
            });
        });
    });

    const jwtOptions = {
        // check authorization headers for JWT
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: config.secret
    };

// Setting JWT login strategy
    const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
        User.findById(payload._id, function (err, user) {
            if (err) {
                return done(err, false);
            }

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

