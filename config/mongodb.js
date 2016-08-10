// 数据库配置
var mongoose=require('mongoose');
// 连接字符串格式为mongodb://主机/数据库名
mongoose.connect('mongodb://192.168.1.184:27107/angular');

exports.mongoose=mongoose;
