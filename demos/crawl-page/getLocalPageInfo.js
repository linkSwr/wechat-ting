const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

module.exports =  function (url) {
    let urlHash = crypto.createHash('md5').update(url).digest('hex').slice(-10);
	let filePath = path.join(__dirname, `./crawlData/${urlHash}.json`);

	// 检查&读取已经拉取的数据
    if (fs.existsSync(filePath)) {
    	return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }

    return false;
}
