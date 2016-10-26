'use strict';

/*
 * 模块依赖
 */

const users = require('../app/controllers/users');
const reports = require('../app/controllers/reports');
const tags = require('../app/controllers/tags');
const auth = require('./middlewares/authorization');

/**
 * 路由中间件
 */
const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

const fail = {
  failureRedirect: '/login'
};

/**
 * 导出路由
 */
module.exports = function (app, passport) {
  const pauth = passport.authenticate.bind(passport);

  // 用户路由
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session',
    pauth('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/users/:userId', users.show);

  app.param('userId', users.load);

  // 报表路由
  app.param('id', reports.load);
  app.get('/reports', reports.index);
  app.get('/reports/new', auth.requiresLogin, reports.new);
  app.post('/reports', auth.requiresLogin, reports.create);
  app.get('/reports/:id', reports.show);
  app.delete('/reports/:id', articleAuth, reports.destroy);

  // 首页路由
  app.get('/', reports.index);

  // 标签路由
  app.get('/tags/:tag', tags.index);


  /**
   * 错误控制
   */
  app.use(function (err, req, res, next) {
    // 作为404对待
    if (err.message
      && (~err.message.indexOf('not found') || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    console.error(err.stack);

    if (err.stack.includes('ValidationError')) {
      res.status(422).render('422', { error: err.stack });
      return;
    }

    // 错误页
    res.status(500).render('500', { error: err.stack });
  });
  // 没有中间件返回假定为404
  app.use(function (req, res) {
    const payload = {
      url: req.originalUrl,
      error: 'Not found'
    };
    if (req.accepts('json')) return res.status(404).json(payload);
    res.status(404).render('404', payload);
  });
};
