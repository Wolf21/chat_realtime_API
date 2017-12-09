
// Importing Node modules and initializing Express
const express = require('express'),  
      app = express(),
      logger = require('morgan'),
      bodyParser = require('body-parser'),
      mongoose = require ('mongoose'),
      path = require('path'),
      config = require('./config/main'),
      passport = require('passport'),
      flash = require('connect-flash'),
      session = require('express-session');
const cookieParser = require('cookie-parser');

// Database Connection
mongoose.connect(config.database);  


// Start the server
const server = app.listen(config.port);  
console.log('Your server is running on port ' + config.port + '.'); 

//SocketIO
socketEvents = require('./socketEvents');  
const io = require('socket.io').listen(server);

socketEvents(io);

//
app.use(cookieParser());

app.use(flash());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//

app.use(session({
    secret: 'Thisismytestkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
    }));
// Setting up basic middleware for all Express requests
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
// app.use(function(req, res, next) {  
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });
//app.use(cookieParser);
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


const apiRoutes = (require('./controllers/routes'));
// connect the api routes under /api/*
app.use('/api', apiRoutes);

//admin routes

const adminRoutes = (require('./controllers/adminRoutes'));
app.use('/', adminRoutes);