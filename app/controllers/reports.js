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
const fs = require('fs');
const path = require('path');
const excelPort = require('excel-export');
const XLSX = require('xlsx');

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
    name: '欢迎使用',
    report: new Report()
  });
};

/**
 * 新建
 */
exports.create = async(function* (req, res) {
  const filename = 'filename';  //只支持字母和数字命名
  var random = Math.floor(Math.random() * 10000 + 0);
  var uploadDir = 'public/upload/excel/';
  var filePath = uploadDir + filename + random + ".xlsx";

  console.log(filePath);

  function datenum(v, date1904) {
    if (date1904) v += 1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
  }

  function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    for (var R = 0; R != data.length; ++R) {
      for (var C = 0; C != data[R].length; ++C) {
        if (range.s.r > R) range.s.r = R;
        if (range.s.c > C) range.s.c = C;
        if (range.e.r < R) range.e.r = R;
        if (range.e.c < C) range.e.c = C;
        var cell = { v: data[R][C] };
        if (cell.v == null) continue;
        var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

        if (typeof cell.v === 'number') cell.t = 'n';
        else if (typeof cell.v === 'boolean') cell.t = 'b';
        else if (cell.v instanceof Date) {
          cell.t = 'n'; cell.z = XLSX.SSF._table[14];
          cell.v = datenum(cell.v);
        }
        else cell.t = 's';

        ws[cell_ref] = cell;
      }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
  }

  /* original data */
  var data = [[1, 2, 3], [true, false, null, "sheetjs"], ["foo", "bar", new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
  var ws_name = "SheetJS";

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
  }

  var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;


  XLSX.writeFile(wb, filePath);

  console.log(req.body);
  res.download(filePath);
  // respond(res, 'reports', {
  // });
  //
  // const report = new Report(only(req.body, 'title body tags'));
  // report.user = req.user;
  // try {
  //   yield report.uploadAndSave(req.file);
  //   respondOrRedirect({ req, res }, `/reports/${report._id}`, report, {
  //     type: 'success',
  //     text: 'Successfully created report!'
  //   });
  // } catch (err) {
  //   respond(res, 'reports/new', {
  //     name: report.name || 'New Report',
  //     errors: [err.toString()],
  //     report
  //   }, 422);
  // }
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
