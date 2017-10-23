
const AuthenticationController = require('./authentication');  
const express = require('express');
const passportService = require('../config/passport');
const passport = require('passport');
const ChatController = require('./chat');


const 	apiRoutes = express.Router(),
        authRoutes = express.Router(),
        chatRoutes = express.Router();


// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });  
const requireLogin = passport.authenticate('local', { session: false });  

// // Constants for role types
// const REQUIRE_ADMIN = "Admin",
//       REQUIRE_MEMBER = "Member";
 
// // Initializing route groups
// const 	apiRoutes = express.Router(),
//     	authRoutes = express.Router();

//=========================
// Auth Routes
//=========================

// Set auth routes as subgroup/middleware to apiRoutes
apiRoutes.use('/auth', authRoutes);

// Registration route
authRoutes.post('/register', AuthenticationController.register);

// Login route
authRoutes.post('/login', requireLogin, AuthenticationController.login);

// Set chat routes as a subgroup/middleware to apiRoutes
apiRoutes.use('/chat', chatRoutes);

// View messages to and from authenticated user
chatRoutes.get('/', requireAuth, ChatController.getConversations);

// Retrieve single conversation
chatRoutes.get('/:conversationId', requireAuth, ChatController.getConversation);

// Send reply in conversation
chatRoutes.post('/:conversationId', requireAuth, ChatController.sendReply);

// Start new conversation
chatRoutes.post('/new/:recipient', requireAuth, ChatController.newConversation);

module.exports = apiRoutes;