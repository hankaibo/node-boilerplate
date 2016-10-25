'use strict';

/**
 * 模块依赖
 */
const mongoose = require('mongoose');
const notify = require('../mailer');

const Schema = mongoose.Schema;

const getTags = tags => tags.join(',');
const setTags = tags => tags.split(',');

/**
 * 报表 Schema
 */
const ReportSchema = new Schema({
  name: { type: String, default: '', trim: true },
  text1: { type: String, default: '', trim: true },//鸡群
  text2: { type: String, default: '', trim: true },//栋数
  text3: { type: String, default: '', trim: true },//周龄
  text4: { type: String, default: '', trim: true },//采样日期
  text5: { type: String, default: '', trim: true },//送检日期
  text6: { type: String, default: '', trim: true },//检测日期
  text7: { type: String, default: '', trim: true },//每栋样品数量
  text8: { type: String, default: '', trim: true },//报表样式
  tags: { type: [], get: getTags, set: setTags },//检测项目
  creatdAt: { type: Date, default: Date.now }
});

// 非空验证
ReportSchema.path('text1').required(true, 'Report text1 cannot be blank');

// Pre-remove hook
ReportSchema.pre('remove', function (next) {
  next();
});

// 实例方法
ReportSchema.methods = {

  /**
   * add
   */
  uploadAndSave: function () {
    const err = this.validateSync();
    if (err && err.toString()) {
      throw new Error(err.toString);
    }
    return this.save();
  }
}

// 静态方法
ReportSchema.statics = {

  /**
   * 通过id获取一条报表数据
   *
   * @param {ObjectId} id
   *
   */
  load: function (_id) {
    return this.findOne({ _id })
      .populate('user', 'name email username')
      .populate('')
      .exec();
  },

  /**
   * 获取所有报表数据
   *
   * @param {Object} options
   */
  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 15;
    return this.find(criteria)
      .populate('user', 'name username')
      .sort({ creatdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

}

mongoose.model('Report', ReportSchema);
