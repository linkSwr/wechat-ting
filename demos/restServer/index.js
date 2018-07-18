// 使用koa启动server
// 注册接口：请求分析页面的接口
// 执行方式：node ./index.js APP_ID AK SK

// 1. 启动本地rest 服务
// 2. 请求里面调用页面抓取
// 3. 把抓取的内容使用语音处理模块进行分段（每段500个字符）解析
// 4. 把解析的音频保存在本地，并且使用mogodb保存音频的信息记录
// 5. 本地音频文件使用${地址md5}_${thunk_id}组成
// 6. 加一个redit之类的模块来对数据进行快速缓存查询？
// 7. 把音频资源的路径通过response返回给页面

// 本地模块
const crawlPage = require('../crawl-page/index');
const parseTextToAudio = require('../yuyin-rest/index');

const Koa = require('koa');
const route = require('koa-route');
const app = new Koa();

const PORT = 7777;
const args = process.argv.slice(2);
// 设置APPID/AK/SK
const APP_ID = args[0];
const API_KEY = args[1];
const SECRET_KEY = args[2];

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// app.use(async ctx => {
//   ctx.body = 'Hello World';
// });

// 错误处理
app.on('error', err => {
  console.error('server error', err)
});

// 注册路由
app.use(route.get('/parse', require('./routes/parse')(APP_ID, API_KEY, SECRET_KEY, {crawlPage, parseTextToAudio})));
app.use(route.get('/get/audio', require('./routes/audio')));

/*
	feature:
	怎么处理这个服务被别人直接利用了？
*/
app.listen(PORT);
