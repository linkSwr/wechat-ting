// 用来记录相关上报信息
// 1. 还没有支持的域名和链接地址
// 2. 把记录写入到本地文件
const path = require('path');
const saveIO = require('./saveIO');
const fs = require('fs');

function recorderUrl(url) {
    let logFilePath = path.join(__dirname, './logs/noOptsUrl.txt');
    let splitStr = '----';
    let wrapStr = '\n\r';
    let contentArr = [splitStr + new Date().toString() + splitStr, url];
    saveIO(logFilePath, contentArr.join(wrapStr) + wrapStr);
}

function saveResult(content, fileName) {
    let logFilePath = path.join(__dirname, `./crawlData/${fileName}.json`);
    let dir = path.join(__dirname, `./crawlData`);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    saveIO(logFilePath, content);
}

const recorderOpts = {
    'noOptsUrl': recorderUrl,
    'crawlData': saveResult
}

function recorder(opts) {
    let {type, data, fileName} = opts;
    
    if (recorderOpts[type]) {
        recorderOpts[type](data, fileName);
    }
}

module.exports = recorder;