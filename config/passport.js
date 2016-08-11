'use strict';

/**
 * 模块依赖
 */
const mongoose = require('mongoose');
const local = require('./passport/local');

const User = mongoose.model('User');

/**
 * 导出
 */
module.exports = function (passport) {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findOne({ _id: id }, done));

  passport.use(local);
}
