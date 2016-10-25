'use strict';

/**
 * 模块依赖
 */
const mongoose = require('mongoose');
const {wrap: async} = require('co');
const only = require('only');
const {respond, respondOrRedirect} = require('../utils');
const Report = mongoose.model('Report');
const assign = Object.assign;

/**
 * 获取一条数据
 */
exports.load = async(function* (req, res, next, id) {
  try {
    req.report = yield Report.load(id);
    if (!req.report) {
      return next(new Error('Report not found'));
    }
  } catch (err) {
    return next(err);
  }
  next();
});

/**
 * 获取列表数据
 */
exports.index = async(function* (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const _id = req.query.item;
  const limit = 15;
  const options = {
    limit: limit,
    page: page
  };

  if (_id) {
    options.criteria = { _id };
  }

  const reports = yield Report.list(options);
  const count = yield Report.count();

  respond(res, 'reports/index', {
    name: 'reports',
    reports: reports,
    page: page + 1,
    pages: Math.ceil(count / limit)
  });
});

/**
 * 跳转到新建页面
 */
exports.new = function (req, res) {
  res.render('reports/new', {
    name: 'new',
    report: new Report()
  });
};

/**
 * 新建
 */
exports.create = async(function* (req, res) {
  const report = new Report(only(req.body, 'title body tags'));
  report.user = req.user;
  try {
    yield report.uploadAndSave(req.file);
    respondOrRedirect({ req, res }, `/reports/${report._id}`, report, {
      type: 'success',
      text: 'Successfully created report!'
    });
  } catch (err) {
    respond(res, 'report/new', {
      name: report.name || 'New Report',
      errors: [err.toString()],
      report
    }, 422);
  }
});

/**
 * 显示
 */
exports.show = function (req, res) {
  respond(res, 'reports/show', {
    name: req.report.name,
    report: req.report
  });
};

/**
 * 删除
 */
exports.destroy = async(function* (req, res) {
  yield req.report.remove();
  respondOrRedirect({ req, res }, '/reports', {}, {
    type: 'info',
    text: 'Deleted successfully'
  });
});
