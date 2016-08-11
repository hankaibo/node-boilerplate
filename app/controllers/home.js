/*
 * 模块依赖
 */

exports.index = function (req, res) {
  res.render('home/index', {
    title: '九次方大数据'
  });
};
