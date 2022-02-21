'use strict';

const path = require('path');
const development = require('./env/development');
const production = require('./env/production');
const test = require('./env/test');

// 通知组件配置
const notifier = {
  service: 'postmark',
  APN: false,
  email: true, // true
  actions: ['comment'],
  tplPath: path.join(__dirname, '..', 'app/mailer/templates'),
  key: 'POSTMARK_KEY'
};

const defaults = {
  root: path.join(__dirname, '..'),
  notifier: notifier
};

module.exports = {
  development: Object.assign({}, development, defaults),
  production: Object.assign({}, production, defaults),
  test: Object.assign({}, test, defaults)
}[process.env.NODE_ENV || 'development'];
