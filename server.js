'use strict';

/**
 * 当执行 npm start 时的主文件，负责启动模块，配置和路由。
 */

/**
 * 模块依赖
 */
require('dotenv').config();

const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config');

const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;
const app = express();

/**
 * 导出
 */
module.exports = app;

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

// Bootstrap routes
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

function listen() {
  if (app.get('env') === 'test') {
    return;
  }
  app.listen(port);
  console.log('Express应用启动端口:' + port);
}

function connect() {
  var options = {
    server: { socketOptions: { keepAlive: 1 } }
  };
  return mongoose.connect(config.db, options).connection;
}


