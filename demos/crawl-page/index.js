var tasksManager = require('./tasksManager');

function app(url) {
	// 使用tasksManager进行任务管理
	return tasksManager(url);
}

var args = process.argv.slice(2);
let URL = args[0];

// 抓取脚本入口
let url = 'http://36kr.com';
// app(URL || url);


module.exports = app;