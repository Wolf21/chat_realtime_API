// const formidable = require('formidable');
// const path = require('path');
// const fs = require('fs');
// const async = require('async');
const express = require ('express');
const passport = require ('passport');
//const { respond, respondOrRedirect } = require('../utils');
const User = require('../models/user');

const requireLogin = passport.authenticate('local', { session: false });

var app = express();

    /** Login admins
    * */

    app.get('/admin/login', (req, res) => {
        // var success = req.flash('success');
        res.render('admin/login',
            {
                title: 'Admin Login'
            }
        );

    });

app.get('/admin', (req, res) => {
    res.render( 'admin/index',
        {
            title: 'Admin index'
        }
    );
});
    /** Admin index
     * */

    app.post('/admin/index',requireLogin, (req, res) => {
        res.render( 'admin/index',
            {
                title: 'Admin index'
            }
        );
    });

    /**
     * Function get all users.
     */

    app.get('/admin/user/listUser', (req, res) => {
        User.find({
            block: 0
        }, (err, users) => {
            console.log(users);
            res.render('admin/user/users',
                {
                    title: 'Users',
                    users: users
                }
            );
        });
    });


    /**
     * Show information admin user.
     */
    app.get('/admin/user/profile', (req, res) => {
        let userId = req.user._id;
        console.log('ID User: ', userId);
        if (userId) {
            // Service find user by id.
            User.findOne({
                _id: userId
            }, (err, user) => {
                console.log(user);
                if (!err && user) {
                    // Response and render a webpage.
                    res.render( 'admin/user/profile', {
                        title: 'Admin Info',
                        user: users
                    });
                } else {
                    // Redirect page.
                     res.render( '/admin/index',
                     {
                        type: 'success',
                        text: 'Edit user successfully'
                     });
                }
            });
        } else {
            // res.redirect('admin/users');
            res.render( '/admin/user/users',
                {
                    user: users,
                    type: 'warning',
                    text: 'Cannot find id user'
                });
        }
    });


    /**
     * Function get information user by id.
     */

    app.get('/admin/user/edit/:userId', (req, res) => {
        let userId = req.params.userId;
        if (userId) {
            // Service find user by id.
            User.findOne({
                _id: userId
            }, (err, user) => {
                console.log(user);
                if (!err && user) {
                    // Response and render a webpage.
                    res.render('admin/user/edit-user',
                    {
                        title: 'Edit User',
                        users: user
                    });
                } else {
                    // Redirect page.
                    res.render('/admin/index',
                    {
                        type: 'success',
                        text: 'Edit user successfully'
                    });
                }
            });
        } else {

            res.render('/admin/user/users',
            {
                type: 'warning',
                text: 'Cannot find id user'
            });
        }
    });

    /**
     * Function update information user by admin.
     */

    app.post('/admin/user/edit/:userId', (req, res) => {
        let userId = req.params.userId;
        if (userId) {
            User.findOne({
                _id: userId
            }, (err, user) => {
                console.log(user);
                if (!err && user) {
                    console.log(req.body);
                    user.profile.firstName = req.body.firstName;
                    user.profile.lastName = req.body.lastName;
                    user.role = req.body.role == 0 ? false : true;
                    user.save((err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // res.redirect('/admin/users');
                            console.log('Update thanh cong!');
                            res.render('admin/user/users',
                            {
                                users: user,
                                type: 'success',
                                text: 'Update user successfully'
                            });
                        }
                    });
                } else {
                    console.log('Khong tim thay user.');
                    res.render('admin/user/users',
                    {
                        users: user,
                        type: 'errors',
                        text: 'Cannot found user from database!'
                    });
                }
            });
        } else {
            res.render('admin/user/users',
            {
                users: user,
                type: 'warning',
                text: 'Cannot find id user'
            });
        }
    });

    /**
     * Function delete user by id.
     */

    app.delete('/admin/user/delete', (req, res) => {
        let idUser = req.body.userId;
        User.update({
            _id: idUser
        }, {
            $set: {
                block: 1
            }
        }, {
            multi: true
        }, (err) => {
            if (err) {
                throw err;
            } else {
                res.json(400);
                console.log('Xoa thanh cong!');
            }
        });
    })
 module.exports = app;