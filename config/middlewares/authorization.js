'use strict';

/*
 *  通用要求登录路由中间件
 */
exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) { return next() };
  if (req.method == 'GET') { req.session.returnTo = req.originalUrl };
  res.redirect('/login');
};

/*
 *  用户授权路由中间件
 */
exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/users/' + req.profile.id);
    }
    next();
  }
};

/*
 *  文章授权路由中间件
 */
exports.article = {
  hasAuthorization: function (req, res, next) {
    if (req.article.user.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/articles/' + req.article.id);
    }
    next();
  }
};

/**
 * 评论授权路由中间件
 */
exports.comment = {
  hasAuthorization: function (req, res, next) {
    // 如果当前用户是评论所有者或文章所有者给他们权限删除
    if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
      next();
    } else {
      req.flash('info', 'You are not authorized');
      res.redirect('/articles/' + req.article.id);
    }
  }
};
