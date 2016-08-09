'use strict';
var configRoutes;

configRoutes = function (app, server) {
  app.get('/', function (request, response) {
    response.redirect('/nodejs.html');
  });
  app.all('/:obj_type/*?', function (request, response, next) {
    response.contentType('json');
    response.header("Access-Control-Allow-Origin","*");
    response.header("Access-Control-Allow-Headers","X-Requested-With");
    response.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    response.header("X-Powered-By","3.2.1");
    response.header("Content-Type","application/json;charset=utf-8");
    next();
  });
  app.get('/:obj_type/list', function (request, response) {
    response.send({ title: request.params.obj_type + ' list' });
  });
  app.post('/:obj_type/create', function (request, response) {
    response.send({ title: request.params.obj_type + ' created' });
  });
  app.get('/:obj_type/read/:id([0-9]+)', function (request, response) {
    response.send({
      title: request.params.obj_type + ' with id ' + request.params.id + ' found'
    });
  });
  app.post('/:obj_type/update/:id[0-9]+', function (request, response) {
    response.send({
      title: request.params.obj_type + ' with id ' + request.params.id + ' updated'
    });
  });
  app.get('/:obj_type/delete/:id[0-9]+', function (request, response) {
    response.send({
      title: request.params.obj_type + ' with id ' + request.params.id + ' deleded'
    });
  });

  //about
  app.get('/dashboard/aboutList', function (request, response) {
    var data={};
    var ABOUT_LIST = [
      { id: 11, name: '胡瑞香', url: '/img/angular.png' },
      { id: 12, name: '吕颖萍', url: '/img/angular.png' },
      { id: 13, name: '徐霞', url: '/img/angular.png' }
    ];
    data['data']=ABOUT_LIST;
    response.send(data);
  });
};
module.exports = { configRoutes: configRoutes }
