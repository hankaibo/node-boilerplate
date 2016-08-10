/**
 * 模块依赖
 */

var mongoose=require('mongoose');
var userPlugin=require('mongoose-user');
var Schema=mongoose.Schema;

/**
 * user schema
 */
var UserSchema=new Schema({
  name:{type:String,default:''},
  email:{type:String,default:''},
  hashed_password:{type:String,default:''},
  salt:{type:String,default:''}
});

/**
 * user plugin
 */
UserSchema.plugin(userPlugin,{});

/**
 * Methods
 */
UserSchema.method({});

/**
 * Statics
 */
UserSchema.static({});

/**
 * Regiter
 */
mongoose.model('User',UserSchema);
