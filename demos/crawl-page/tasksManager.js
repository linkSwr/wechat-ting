const crypto = require('crypto');
const tinyTask = require('./tinyTask'); // return Promise
const crawl = require('./crawl');

let tasks = {};
let waittingTasks = [];
let maxTaskCount = 10; // 同一时间可以执行一个
let runningTaskNum = 0;

function getStrMd5(str) {
    let md5 = crypto.createHash('md5');

    return md5.update(str).digest('hex')
}

function standardProgress(url) {
    let urlHex = getStrMd5(url);
    let fn = crawl;

    if (tasks[urlHex]) {
        return;
    }

    runningTaskNum++;

    // 抓取
    tasks[urlHex] = tinyTask(url, fn);
    tasks[urlHex]
    .then((oldUrlHex => data => {
        runningTaskNum--;
        if (waittingTasks.length) {
            let url = waittingTasks.shift();

            standardProgress(url);
        }
        delete tasks[oldUrlHex];
    })(urlHex));
}

function manager(url) {
    // 使用url的值生成一个md5 key
    // 如果tasks没有当前url下面没有对应的key的话就新建应用
    // 每个线程的同时进行10个抓取操作，其他进行等待

    if (runningTaskNum > maxTaskCount) {
        waittingTasks.push(url);
        return;
    }

    standardProgress(url);
}

module.exports = manager;
