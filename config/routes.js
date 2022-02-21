'use strict';

/*
 * 模块依赖
 */

const users = require('../app/controllers/users');
const articles = require('../app/controllers/articles');
const comments = require('../app/controllers/comments');
const tags = require('../app/controllers/tags');
const excel = require('../app/controllers/excel');
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
module.exports = function(app, passport) {
  const pauth = passport.authenticate.bind(passport);

  // 用户路由
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post(
    '/users/session',
    pauth('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }),
    users.session
  );
  app.get('/users/:userId', users.show);
  app.get(
    '/auth/facebook',
    pauth('facebook', {
      scope: ['email', 'user_about_me'],
      failureRedirect: '/login'
    }),
    users.signin
  );
  app.get(
    '/auth/facebook/callback',
    pauth('facebook', fail),
    users.authCallback
  );
  app.get('/auth/github', pauth('github', fail), users.signin);
  app.get('/auth/github/callback', pauth('github', fail), users.authCallback);
  app.get('/auth/twitter', pauth('twitter', fail), users.signin);
  app.get('/auth/twitter/callback', pauth('twitter', fail), users.authCallback);
  app.get(
    '/auth/google',
    pauth('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }),
    users.signin
  );
  app.get('/auth/google/callback', pauth('google', fail), users.authCallback);
  app.get(
    '/auth/linkedin',
    pauth('linkedin', {
      failureRedirect: '/login',
      scope: ['r_emailaddress']
    }),
    users.signin
  );
  app.get(
    '/auth/linkedin/callback',
    pauth('linkedin', fail),
    users.authCallback
  );

  app.param('userId', users.load);

  // 文章路由
  app.param('id', articles.load);
  app.get('/articles', articles.index);
  app.get('/articles/new', auth.requiresLogin, articles.new);
  app.post('/articles', auth.requiresLogin, articles.create);
  app.get('/articles/:id', articles.show);
  app.get('/articles/:id/edit', articleAuth, articles.edit);
  app.put('/articles/:id', articleAuth, articles.update);
  app.delete('/articles/:id', articleAuth, articles.destroy);

  // 首页路由
  app.get('/', articles.index);

  // 评论路由
  app.param('commentId', comments.load);
  app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.delete(
    '/articles/:id/comments/:commentId',
    commentAuth,
    comments.destroy
  );

  // 标签路由
  app.get('/tags/:tag', tags.index);

  // Excel路由
  app.get('/execl', excel.write);

  /**
   * 错误控制
   */
  app.use(function(err, req, res, next) {
    // 作为404对待
    if (
      err.message &&
      (~err.message.indexOf('not found') ||
        ~err.message.indexOf('Cast to ObjectId failed'))
    ) {
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
  app.use(function(req, res) {
    const payload = {
      url: req.originalUrl,
      error: 'Not found'
    };
    if (req.accepts('json')) return res.status(404).json(payload);
    res.status(404).render('404', payload);
  });
};
