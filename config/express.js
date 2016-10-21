'use strict';

/**
 * 模块依赖
 */

const express = require('express');
const session = require('express-session');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const csrf = require('csurf');
const cors = require('cors');
const upload = require('multer')();

const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const winston = require('winston');
const helpers = require('view-helpers');
const config = require('./');
const pkg = require('../package.json');

const env = process.env.NODE_ENV || 'development';

/**
 * 导出
 */
module.exports = function (app, passport) {

  // 压缩中间件 (在express.static之前设置)
  app.use(compression({
    threshold: 512
  }));

  app.use(cors());

  // 静态文件中间件
  app.use(express.static(config.root + '/public'));

  // 生产环境使用winston日志组件
  let log = 'dev';
  if (env !== 'development') {
    log = {
      stream: {
        write: message => winston.info(message)
      }
    };
  }

  // 测试环境不记录日志
  // 日志中间件
  if (env !== 'test') { app.use(morgan(log)) };

  // 设置视图路径，模板引擎和布局
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  // 导出package.json变量
  app.use(function (req, res, next) {
    res.locals.pkg = pkg;
    res.locals.env = env;
    next();
  });

  // 在methodOverride之前解析参数
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(upload.single('image'));
  app.use(methodOverride(function (req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  // 在session之前解析cookie
  app.use(cookieParser());
  app.use(cookieSession({ secret: 'secret' }));
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: pkg.name,
    store: new mongoStore({
      url: config.db,
      collection: 'sessions'
    })
  }));

  // 使用 passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // connect flash for flash messages - should be declared after sessions
  app.use(flash());

  // 最后宣布它们
  app.use(helpers(pkg.name));

  if (env == 'test') {
    app.use(csrf());

    // This could be moved to view-helpers :-)
    app.use(function (req, res, next) {
      res.locals.csrf_token = req.csrfToken();
      next();
    });
  }

  if (env === 'development') {
    app.locals.pretty = true;
  }
};
