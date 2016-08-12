'use strict';

/**
 * 模块依赖
 */

const { wrap: async } = require('co');
const { respondOrRedirect } = require('../utils');

/**
 * 获取一条数据
 */
exports.load = function (req, res, next, id) {
  req.comment = req.article.comments.find(comment => comment.id === id);

  if (!req.comment) { return next(new Error('评论没有找到')); }
  next();
};

/**
 * 新建
 */
exports.create = async(function* (req, res) {
  const article = req.article;
  yield article.addComment(req.user, req.body);
  respondOrRedirect({ res }, `/articles/${article._id}`, article.comments[0]);
});

/**
 * 删除
 */
exports.destroy = async(function* (req, res) {
  yield req.article.removeComment(req.params.commentId);
  req.flash('info', 'Removed comment');
  res.redirect('/articles/' + req.article.id);
  respondOrRedirect({ req, res }, `/articles/${req.article.id}`, {}, {
    type: 'info',
    text: 'Removed comment'
  });
});
