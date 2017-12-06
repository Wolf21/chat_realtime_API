
//'use strict'

const jwt = require('jsonwebtoken'),  
      crypto = require('crypto'),
      User = require('../models/user'),
      config = require('../config/main');

      
function generateToken(user) {  
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}

// Set user info from request
function setUserInfo(request) {  
  return {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    role: request.role,
  };
}



  //========================================
// Login Route
//========================================
exports.login = function(req, res, next) {

  let userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    user: userInfo
  });
}


//========================================
// Register Route
//========================================
exports.register = function(req, res, next) {  

  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const role = req.body.role;

  // Return error if no email
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.'});
  }

  // Return error if No full name
  if (!firstName || !lastName) {
    return res.status(422).send({ error: 'You must enter your full name.'});
  }

  // Return error if no password
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ email: email }, function(err, existingUser) {
      if (err) { return next(err); }

      // If user existed, return error
      if (existingUser) {
        return res.status(422).send({ error: 'That email address is already in use.' });
      }

      // If email is unique and have password , create account
      let user = new User({
        email: email,
        password: password,
        profile: { firstName: firstName, lastName: lastName },
        role: role
      });

      user.save(function(err, user) {
        if (err) { return next(err); }


        // Respond with JWT if user was created

        let userInfo = setUserInfo(user);

        res.status(201).json({
          token: 'JWT ' + generateToken(userInfo),
          user: userInfo
        });
      });
  });
}


// Role authorization check
exports.roleAuthorization = function(role) {  
  return function(req, res, next) {
    const user = req.user;

    User.findById(user._id, function(err, foundUser) {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      // If user is found, check role.
      if (foundUser.role == role) {
        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    });

  }
}
exports.isLoggedIn= function(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

exports.index = (req, res, next) => {
    console.log("URL " + req.url + ": " + req.user);
    if (req.session.cookie.originalMaxAge !== null) {
        res.redirect('/home');
    } else {
        res.render('admin/index', { title: 'Index Page' });
    }
}

/**
 * Controller login
 * Method: GET
 */

exports.getLogin = (req, res) => {
    var errors = req.flash('error');
    res.render('admin/login', { title: 'Login', messages: errors, hasErrors: errors.length > 0 });
}

/**
 * Controller Login
 * Method: POST
 */

exports.login = (req, res) => {
    // res.locals.user = req.user;
    req.session.cookie.user = req.user;
    console.log(req.session.cookie.user);
    // if (req.body.rememberme) {
    //     req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    // } else {
    if (req.session.expires = null) {
        res.redirect('/admin');
    };
}

/**
 * Controller home
 * Method: GET
 */

exports.home = (req, res) => {
    console.log(`Cookie : ${req.session.cookie}     passport: ${req.user}`);
    res.render('admin/home', { title: 'Home', user: req.user });
}


      