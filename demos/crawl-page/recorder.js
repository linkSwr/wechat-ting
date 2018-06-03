// 用来记录相关上报信息
// 1. 还没有支持的域名和链接地址
// 2. 把记录写入到本地文件
const path = require('path');
const saveIO = require('./saveIO');

function recorderUrl(url) {
    let logFilePath = path.join(__dirname, './logs/noOptsUrl.txt');
    let splitStr = '----';
    let wrapStr = '\n\r';
    let contentArr = [splitStr + new Date().toString() + splitStr, url];
    saveIO(logFilePath, contentArr.join(wrapStr) + wrapStr);
}

function saveResult(content) {
    let logFilePath = path.join(__dirname, `./crawlData/${new Date().valueOf()}.json`);
    saveIO(logFilePath, content);
}

const recorderOpts = {
    'noOptsUrl': recorderUrl,
    'crawlData': saveResult
}

function recorder(opts) {
    let {type, data} = opts;
    
    if (recorderOpts[type]) {
        recorderOpts[type](data);
    }
}

module.exports = recorder;