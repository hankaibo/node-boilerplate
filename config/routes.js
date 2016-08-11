'use strict';

/**
 * 模块依赖
 */
const home = require('../app/controllers/home');

/**
 * 导出
 */
module.exports = function (app, passport) {
  app.get('/', home.index);

  /**
   * 错误控制
   */
  app.use(function (err, req, res, next) {
    if (err.message
      && (~err.message.indexOf('not found') || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // 错误页面
    res.status(500).render('500', { error: err.stack });
  });

  // 404页面
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: '你懂的'
    });
  });

};
