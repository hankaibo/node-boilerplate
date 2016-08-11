/**
 * 模块依赖
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

var Schema = mongoose.Schema;
const oAuthTypes = [
  // 'github'
]

/**
 * user schema
 */
const UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  provider: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' },
  github: {}
});

const validatePresenceOf = value => value && value.length;

/**
 * 虚函数
 */
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  })

/**
 * Validations
 */
UserSchema.path('username').validate(function (username) {
  if (this.skipValidation()) {
    return true;
  }
  return name.length;
}, '用户名不可为空');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  if (this.skipValidation()) {
    return true;
  }
  return hashed_password.length && this._password.length;
}, '密码不可为空');


/**
 * 方法
 */
UserSchema.method = {
  /**
   * Authenticate - 检查密码是否相同
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this._password;
  },
  /**
   * MakeSalt - 生成盐
   */
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },
  /**
   * EncrypePassword - 加密密码
   */
  encryptPassword: function (password) {
    if (!password) {
      return '';
    }
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
  /**
   *
   */
  skipValidation: function () {
    return ~oAuthTypes.indexOf(this.provider);
  }
};

/**
 * 静态属性
 */
UserSchema.static = {
  load: function (options, cb) {
    options.select = option.select || 'name username';
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  }
};

/**
 * 注册
 */
mongoose.model('User', UserSchema);
