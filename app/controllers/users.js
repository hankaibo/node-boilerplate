'use strict';

/**
 * 模块依赖
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');

/**
 * Load
 */
exports.load = async(function* (req, res, next, _id) {
  const criteria = { _id };
  try {
    req.profile = yield User.load({ criteria });
    if (!req.profile) {
      return next(new Error('User not found'));}
  } catch (err) {
    return next(err);
  }
  next();
});

/**
 * 新建
 */
exports.create = async(function* (req, res) {
  const user = new User(req.body);
  user.provider = 'local';
  try {
    yield user.save();
    req.logIn(user, err => {
      if (err) {
        req.flash('info', 'Sorry! We are not able to log you in!');
      }
      return res.redirect('/');
    });
  } catch (err) {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message);

    res.render('home/index', {
      title: 'Sign up',
      errors,
      user
    });
  }
});

exports.signin = function () {};

/**
 * Auth callback
 */

exports.authCallback = login;


/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  const redirectTo = req.session.returnTo ? req.session.returnTo : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
}
