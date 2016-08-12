'use strict';

/*!
 * 模块依赖
 */

const mongoose = require('mongoose');
const User = mongoose.model('User');

const local = require('./passport/local');
const google = require('./passport/google');
const facebook = require('./passport/facebook');
const twitter = require('./passport/twitter');
const linkedin = require('./passport/linkedin');
const github = require('./passport/github');

/**
 * 导出
 */
module.exports = function (passport) {

  // 序列化 sessions
  passport.serializeUser((user, cb) => cb(null, user.id));
  passport.deserializeUser((id, cb) => User.load({ criteria: { _id: id } }, cb));

  // 使用策略
  passport.use(local);
  passport.use(google);
  passport.use(facebook);
  passport.use(twitter);
  passport.use(linkedin);
  passport.use(github);
};
