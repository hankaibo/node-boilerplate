'use strict';

/**
 * 模块依赖
 */
const mongoose = require('mongoose');
const User = mongoose.model('User');

const local = require('./passport/local');

/**
 * 导出
 */
module.exports = function (passport) {
  // 序列化sessions
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findOne({ _id: id }, done));

  // 使用
  passport.use(local);
}
