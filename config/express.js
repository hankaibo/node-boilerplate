/**
 * 模块依赖
 */

var express = require('express');
var session = require('express-session');
var compression = require('compression');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var csrf = require('csurf');
var cors = require('cors');

var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var winston = require('winston');
var helpers = require('view-helpers');
var jade = require('jade');
var config = require('./');
var pkg = require('../package.json');

var env = process.env.NODE_ENV || 'development';

/**
 * 导出
 */
module.exports = function (app, passport) {
  // 合并中间件(在express.static之前)
  app.use(compression({
    threshold: 512
  }));

  // CORS
  app.use(cors());

  // 静态文件路径中间件
  app.use(express.static(config.root + '/public'));

  // 生产环境下使用 winston 日志框架记录日志
  var log;
  if (env !== 'development') {
    log = {
      stream: {
        write: message => winston.info(message)
      }
    };
  }

  // 日志中间件(测试环境不使用日志)
  if (env !== 'test') {
    app.use(morgan(log));
  }

  // 使用模板引擎，设置视图路径和默认布局
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  // 导出package.json变量到views
  app.use(function (req, res, next) {
    res.locals.pkg = pkg;
    res.locals.env = env;
    next();
  });

  // 对请求内容进行解析(在methodOverride前面)
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  // cookieParser 中间件应该在 session 之前
  app.use(cookieParser());
  app.use(cookieSession({ secret: 'secret' }));
  app.use(session({
    secret: pkg.name,
    proxy: true,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
      url: config.db,
      collection: 'sessions'
    })
  }));

  // 使用 passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // 使用flash给flash messages(应该在声明sessions之后，显示信息的可选组件)
  app.use(flash());

  // 在session和flash之后声明使用
  app.use(helpers(pkg.name));

  // 添加CSRF支持
  if (process.env.NODE_ENV !== 'test') {
    app.use(csrf());
    //
    app.use(function (req, res, next) {
      res.locals.csrf_token = req.csrfToken();
      next();
    });
  }

  if (env === 'development') {
    app.locals.pretty = true;
  }

};
