'use strict';

/**
 * 模块依赖
 */

const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const co = require('co');

/**
 * 清空数据库
 *
 * @param {Object} t<Ava>
 * @api public
 */

exports.cleanup = function (t) {
  co(function* () {
    yield User.remove();
    yield Article.remove();
    t.end();
  });
};
