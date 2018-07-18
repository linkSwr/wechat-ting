const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const recordPath = path.join(__dirname, `../audioRecord.json`);
let audioRecord = fs.existsSync(recordPath) && fs.readFileSync(recordPath, 'utf8');

if (audioRecord) {
	audioRecord = JSON.parse(audioRecord);
}
else {
	audioRecord = {};
}

const parse = (appId, ak, sk, modules) => async ctx => {
	// 请求格式：/parse?pageUrl=
	// 解析query的内容，获取需要抓取的页面地址
	// 调用页面抓取模块和语音生成模块
	// 返回音频的获取地址
	let {crawlPage, parseTextToAudio} = modules;
	let {pageUrl} = ctx.query;

	/*
	  phtomjs 启动耗时比较长怎么办？ 
	*/
	return crawlPage(pageUrl)
	.then(data => {
		console.log('获取到的页面内容', pageUrl, data);

		let urlHash = crypto.createHash('md5').update(pageUrl).digest('hex').slice(-10);

		// 如果已经转换过就不再请求转换了。
		let	promise;
		if (audioRecord[urlHash]) {
			promise = new Promise((resolve) => {
				resolve(audioRecord[urlHash].thunks);
			});
		}
		else {
			promise = parseTextToAudio(data.content, pageUrl, {
				APP_ID: appId,
				API_KEY: ak,
				SECRET_KEY: sk
			});
		}

		return promise.then(result => {
			// 把当前语音的记录存储到本地
			let urlHash = crypto.createHash('md5').update(pageUrl).digest('hex').slice(-10);
			audioRecord[urlHash] = {
				thunks: result,
				url: pageUrl,
				title: data.title
			}

			fs.writeFile(recordPath, JSON.stringify(audioRecord), (err) => {
			  	if (err) throw err;
			});

			return {
				title: data.title,
				content: data.content,
				url: pageUrl,
				thunks: result
			}
		});
	})
	.then(data => {
		ctx.body = JSON.stringify(data);
		console.log('parse list result', data);
	});
};

module.exports = parse;
