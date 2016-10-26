'use strict';

/**
 * 模块依赖
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const Report = mongoose.model('Report');

/**
 * List items tagged with a tag
 */

exports.index = async(function* (req, res) {
  const criteria = { tags: req.params.tag };
  const page = (req.params.page > 0 ? req.params.page : 1) - 1;
  const limit = 30;
  const options = {
    limit: limit,
    page: page,
    criteria: criteria
  };

  const Reports = yield Report.list(options);
  const count = yield Report.count(criteria);

  respond(res, 'Reports/index', {
    title: 'Reports tagged ' + req.params.tag,
    Reports: Reports,
    page: page + 1,
    pages: Math.ceil(count / limit)
  });
});
