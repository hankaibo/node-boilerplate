/**
 * 模块依赖
 */

var path = require('path');
var extend = require('util')._extend;

var development = require('./env/development');
var production = require('./env/production');
var test = require('./env/test');

var defaults = {
  root: path.join(__dirname, '..'),
};

/**
 * 导出
 */
module.exports = {
  development: extend(development, defaults),
  production: extend(production, defaults),
  test: extend(test, defaults)
}[process.env.NODE_ENV || 'development'];

