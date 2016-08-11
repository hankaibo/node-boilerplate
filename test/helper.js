'use strict';

/**
 * 模块依赖
 */

const mongoose = require('mongoose');
const User = mongoose.model('User');
const co = require('co');

/**
 * 清空数据空
 */

exports.cleanup = function (t) {
  co(function* () {
    yield User.remove();
    t.end();
  });
};
