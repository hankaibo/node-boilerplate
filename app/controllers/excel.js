'use strict';

/**
 * 模块依赖
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { wrap: async } = require('co');
const excelPort = require('excel-export');

/**
 * 模拟生成电子表格
 */
exports.write = async(function* (req, res) {
  const conf = {};
  const filename = 'filename';  //只支持字母和数字命名

  conf.cols = [
    { caption: '名称', type: 'string', width: 20 },
    { caption: '简介', type: 'string', width: 40 },
    { caption: '报酬', type: 'string', width: 20 }
  ];

  var array = [];
  array[0] = [
    'datas[0][0]',
    'datas[0][1]',
    'datas[0][2]'
  ];

  conf.rows = array[0];
  var result = excelPort.execute(conf);
  var random = Math.floor(Math.random() * 10000 + 0);
  var uploadDir = 'public/upload/excel/';
  var filePath = uploadDir + filename + random + ".xlsx";

  fs.writeFile(filePath, result, 'binary', function (err) {
    if (err) {
      console.log(err);
    }
  });

});

