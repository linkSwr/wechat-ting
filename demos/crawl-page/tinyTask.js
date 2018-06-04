const recorder = require('./recorder');

function tinyTask(params, fn, opts) {
    // 执行fn，fn返回一个Promise
    let result = fn(params, opts);

    if (result.then) {
        return result.then(result => {

            // listPage类型的页面会返回空结果
            if (result) {
                // 记录任务结果内容
                recorder({
                    type: 'crawlData',
                    data: JSON.stringify(result) // String
                });
            }

            return result;
        })
        .catch(result => {
            // 记录不能处理的结果
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