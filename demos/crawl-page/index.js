var tasksManager = require('./tasksManager');

function app(url) {
	// 使用tasksManager进行任务管理
	tasksManager(url);
}

// 抓取脚本入口
let url = 'http://36kr.com/p/5136042.html';
app(url);