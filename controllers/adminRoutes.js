
// const formidable =
const express = require ('express');
const path = require('path');
const fs = require('fs');
const async = require('async');
const passport =require('passport');
const passportService = require('../config/passport');
const { respond , respondOrRedirect } = require('../utils');
const requireLogin = passport.authenticate('local', { session: false });
const authentication = require('./authentication');

const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');

//const requireLogin = passport.authenticate('localLogin', { session: false });
//const requireAdmin = authorization.admin;
//var app = express();
function isLoggedIn(req, res, next) {
    if (req.session.cookie.user) {
        return next();
    }
    res.redirect('/admin/login');
}
var router = express.Router();

    // router.get('/admin', function(req, res) {
    //     // var success = req.flash('success');
    //         respond(res, 'admin/index', {
    //             title: 'Admin Index',
    //             success: req.flash('success', 'Login successfully!')
    //         });
    // });

    router.get('/admin',authentication.index);

    router.get('/admin/login',authentication.getLogin);

    router.post('/admin/login',authentication.login, passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/admin/login',
        failureFlash: true,
        session:false
    }));
    router.get('/admin/home',isLoggedIn(),authentication.home);

    // respond(res, '/admin/index', {
    //     title: 'Admin Index',
    //     success: req.flash('success', 'Login successfully!')
    // });

    /**
     * Function get all users.
     */

    router.get('/admin/listUser', function(req, res) {
        User.find({
            block: 0
        }, function(err, users) {
            respond(res, 'admin/user/users', {
                title: 'Users',
                users: users
            });
        });
    });


    /**
     * Show information admin user.
     */
    router.get('/admin/user/profile', function(req, res) {
        let userId = req.user._id;
        console.log('ID User: ', userId);
        if (userId) {
            // Service find user by id.
            User.findOne({
                _id: userId
            }, function(err, user) {
                console.log(user);
                if (!err && user) {
                    // Response and render a webpage.
                    respond(res, 'admin/user/profile', {
                        title: 'Admin Info',
                        user: user
                    });
                } else {
                    // Redirect page.
                    respondOrRedirect({ req, res }, '/admin/listUser', {}, {
                        type: 'success',
                        text: 'Edit user successfully'
                    });
                }
            });
        } else {
            // res.redirect('admin/users');
            respondOrRedirect({ req , res }, '/admin/listUser', {}, {
                type: 'warning',
                text: 'Cannot find id user'
            });
        }
        // respond(res, 'admin/user/profile', {
        //     title: 'Admin Profile',
        //     success: req.flash('success', 'Login successfully!')
        // });
    });


    /**
     * Function get information user by id.
     */

    router.get('/admin/user/edit/:userId', function(req, res) {
        let userId = req.params.userId;
        if (userId) {
            // Service find user by id.
            User.findOne({
                _id: userId
            }, function(err, user) {
                if (!err && user) {
                    // Response and render a webpage.
                    respond(res, 'admin/user/edit-user', {
                        title: 'Edit User',
                        user: user
                    });
                } else {
                    // Redirect page.
                    respondOrRedirect({ req, res }, '/admin/listUser', {}, {
                        type: 'success',
                        text: 'Edit user successfully'
                    });
                }
            });
        } else {
            // res.redirect('admin/users');
            respondOrRedirect({ req, res }, '/admin/listUser', {}, {
                type: 'warning',
                text: 'Cannot find id user'
            });
        }
    });

    /**
     * Function update information user by admin.
     */

    router.post('/admin/user/edit/:userId', function(req, res) {
        let userId = req.params.userId;
        if (userId) {
            User.findOne({
                _id: userId
            }, function(err, user){
                if (!err && user) {
                    console.log(req.body);
                    user.profile.firstName = req.body.firstName;
                    user.profile.lastName = req.body.lastName;
                    user.role = req.body.role === 'User' ? 'User' : 'Admin';
                    user.save(function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            // res.redirect('/admin/users');
                            console.log('Update thanh cong!');
                            respondOrRedirect({ req, res }, '/admin/listUser', {}, {
                                type: 'success',
                                text: 'Update user successfully'
                            });
                        }
                    });
                } else {
                    // res.redirect('/admin/users');
                    console.log('Khong tim thay user.');
                    respondOrRedirect({ req, res }, '/admin/listUser', {}, {
                        type: 'errors',
                        text: 'Cannot found user from database!'
                    });
                }
            });
        } else {
            respondOrRedirect({ req, res }, '/admin/listUser', {}, {
                type: 'warning',
                text: 'Cannot find id user'
            });
        }
    });

    /**
     * Function delete user by id.
     */

    router.delete('/admin/user/delete', function(req, res) {
        let idUser = req.body.userId;
        User.update({
            _id: idUser
        }, {
            $set: {
                block: 1
            }
        }, {
            multi: true
        }, function(err) {
            if (err) {
                throw err;
            } else {
                res.json(400);
                console.log('Xoa thanh cong!');
            }
        });
    })

    /** Routes list conversation
    */
    router.get('/admin/conversations/list', function(req, res) {
        Conversation.find( function(err, conversations) {
            respond(res, 'admin/conversations', {
                title: 'Conversations',
                conversations : conversations
            });
        });
    });


    /**
     * Function get information user by id.
     */

    router.get('/admin/conversations/details/:ConversationId', function(req, res) {
        let ConversationId = req.params.ConversationId;
        if (ConversationId) {
            // Service find conversation by id.
            Message.find({
                conversationId: ConversationId
            }, function(err, message) {
                if (!err && message) {
                    // Response and render a web page.
                    respond(res, 'admin/conversations-details', {
                        title: 'Conversation Details',
                        message : message
                    });
                } else {
                    // Redirect page.
                    respondOrRedirect({ req, res }, '/admin/conversations/list', {}, {
                        type: 'success',
                        text: 'successfully'
                    });
                }
            });
        } else {
            // res.redirect('admin/users');
            respondOrRedirect({ req, res }, '/admin/conversations/list', {}, {
                type: 'warning',
                text: 'Cannot find id conversation'
            });
        }
    });



    /**
     * Routes author details
     */

    router.get('/admin/conversations/details/author/:authorId', function(req, res) {
        let authorId = req.params.authorId;
        if (authorId) {
            // Service find conversation by id.
            User.find({
                _id: authorId
            }, function(err, user) {
                if (!err && user) {
                    // Response and render a web page.
                    respond(res, 'admin/conversations-author', {
                        title: 'Author Details',
                        user : user
                    });
                } else {
                    // Redirect page.
                    respondOrRedirect({ req, res }, '/admin/conversations/list', {}, {
                        type: 'success',
                        text: 'successfully'
                    });
                }
            });
        } else {
            // res.redirect('admin/users');
            respondOrRedirect({ req, res }, '/admin/conversations/list', {}, {
                type: 'warning',
                text: 'Cannot find id conversation'
            });
        }
    });

    /**
     * delete message
     **/
    router.delete('/admin/conversations/delete_message', function(req, res) {
        let messageId = req.body.messageId;
        Message.deleteOne({
            _id: messageId
        },function(err) {
            if (err) {
                throw err;
            } else {
                res.json(400);
                console.log('Xoa thanh cong!');
            }
        });
    })

    /**
     * Routes logout
     */
    router.get('/admin/logout',function(req, res){
                req.logout();
                req.session.destroy(function(err){
                    res.redirect('/admin/login');
                });
            })
module.exports = router;
