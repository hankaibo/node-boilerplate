
# Jusfoun Nodejs API

九次方nodejs接口应用。

## 环境要求

* [NodeJs](http://nodejs.org) >= 6.x
* [mongodb](http://mongodb.org)

## 安装

```sh
$ git clone git@git.oschina.net:hankaibo/nodejs.git
$ npm install
```

**注意:** 不要忘记设置facebook, twitter, google, linkedin和github `CLIENT_ID`和`SECRET`。在`development`环境中，你可以通过设置env变量

```sh
cp .env.example .env
```

然后替换相应的值。在`production`环境，如果你这么干可不是安全的噢！因此你需要通过命令行设置它们。如果使用heroku，请移步[here](https://devcenter.heroku.com/articles/config-vars)。

如果你想要使用图片上传，不要忘记设置图片配置的变量值，切记切记！

```sh
IMAGER_S3_KEY=AWS_S3_KEY
IMAGER_S3_SECRET=AWS_S3_SECRET
IMAGER_S3_BUCKET=AWS_S3_BUCKET
```

然后，启动吧，骚年！

```sh
$ npm start
```

验证奇迹的时刻 [http://localhost:3000/](http://localhost:3000/)

## 测试

```sh
$ npm test
```

## 版权

MIT
