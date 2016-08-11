'use strict';

/**
 * 模块依赖
 */
const home = require('../app/controllers/home');
const users = require('../app/controllers/users');

/**
 * 导出
 */
module.exports = function (app, passport) {
  const pauth = passport.authenticate.bind(passport);

  // 视图跳转
  app.get('/', home.index);
  // 用户路由
  app.post('/users/session',
    pauth('local', {
      failureRedirect: '/login',
      failureFlash: '用户名称和密码错误'
    }), users.session);
  app.get('/test', function(req, res) {
    res.json({ message: 'You are running dangerously low on beer!' });
  });

  // 错误控制
  app.use(function (err, req, res, next) {
    if (err.message
      && (~err.message.indexOf('not found') || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // 错误页面
    res.status(500).render('500', { error: err.stack });
  });
  // 404页面
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: '你懂的'
    });
  });

};
