/**
 * 模块依赖
 * 认证策略使用本地认证策略
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

/**
 * 导出
 */
module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    var options = {
      criteria: {
        email: email
      },
      select :' name username email hash_password salt'
    };
    User.load(options, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: '未知用户' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: '无效密码' });
      }
      return done(null, user);
    });
  }
);
