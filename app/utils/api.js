/**
 * 本接口采用commonjs规范实现。
 * @author jusfoun
 */
var $ = require("jquery.js");

// 与业务无关的常量定义
const jusfounConst = {
  IP: 'http://localhost/',
  PORT: 3000,
  PROJECT: 'project',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  DATA_TYPE_JSON: 'json',
  DATA_TYPE_JSONP: 'jsonp'
};


/**
 *
 * 如果回调函数错误就抛出异常不再执行并打印错误信息。
 */
function isFunctionJsufoun(callback) {
  if (!$.isFunction(callback)) {
    try {
      throw new Error("回调函数定义错误！");
    } catch (e) {
      console.log(e.name + ": " + e.message);
      console.log(e.stack);
    }
  }
}

/**
 * 获取当日日度指数，包括当日农产品批发价格总指数与“菜篮子”产品批发价格指数。
 */
exports.priceIndexDailyCurrent = function (parameter, callback) {
  // 1.要不要判断参数？
  if (parameter) {//参数为空，

  } else {

  }

  // 2.要不要判断回调函数?
  isFunctionJsufoun(callback);

  $.ajax({
    type: jusfounConst.GET,
    url: jusfounConst.PREURL + jusfounConst.PORT,
    dataType: jusfounConst.DATA_TYPE_JSONP,
    success: function (data, textStatus, jqXHR) {
      callback.call(this, this.data, this.textStatus);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      callback.call(this, textStatus, errorThrown);
    }
  });

}

