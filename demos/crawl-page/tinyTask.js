const recorder = require('./recorder');
const crypto = require('crypto');
const getLocalPageInfo = require('./getLocalPageInfo');

function tinyTask(url, fn, opts) {
    // 执行fn，fn返回一个Promise
    let result = fn(url, opts);
    let localInfo = getLocalPageInfo(url);
    let isLocalData = false;

    if (localInfo) {
        result = new Promise(resolve => {
            isLocalData = true;
            resolve(localInfo);
        })
    }
    else {
        result = fn(url, opts);
    }

    if (result.then) {
        return result.then(result => {
            // listPage类型的页面会返回空结果
            if (result && !isLocalData) {

                let urlHash = crypto.createHash('md5').update(url).digest('hex').slice(-10);
                // 记录任务结果内容
                recorder({
                    type: 'crawlData',
                    data: JSON.stringify(result), // String
                    fileName: urlHash
                });
            }

            return result;
        })
        .catch(result => {
            // 记录不能处理的结果
            console.error('tinyTask catch', result)
            switch(result.type) {
                case 'noOpts':
                    recorder({
                        type: 'noOptsUrl',
                        data: result.data // String
                    });
                    break;
            }
        })
    }

    return result;
}

module.exports = tinyTask;