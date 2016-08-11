/**
 * 模块依赖
 */

var mongoose = require('mongoose');
var userPlugin = require('mongoose-user');
var Schema = mongoose.Schema;

/**
 * user schema
 */
var UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' }
});

/**
 * 用户插件
 */
UserSchema.plugin(userPlugin, {});

/**
 * 方法
 */
UserSchema.method({});

/**
 * 静态属性
 */
UserSchema.static({});

/**
 * 注册
 */
mongoose.model('User', UserSchema);
