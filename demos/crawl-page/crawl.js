const https = require('https');
const http = require('http');
const cheerio = require('cheerio');
const {URL} = require('url');
const websiteOpts = require('./websiteOpts');
const path = require('path');

function usePhantomjs(url) {
    const childProcess = require('child_process');
    const scriptPath = path.resolve(__dirname, './phantomjsRunner.js');
    // const ls = spawn('phantomjs', [scriptPath, url]);

    // const childProcess = require('child_process');
    const phantomjs = require('phantomjs-prebuilt');
    const binPath = phantomjs.path;
     
    const childArgs = [
      path.join(__dirname, './phantomjsRunner.js'),
      url
    ]
     
    return new Promise((resolve, reject) => {
        let result = '';

        childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
            // handle results
            if (stdout) {
                result += stdout;
                // console.log(`输出：${result}`);

                resolve(result);
            }
        })
    });

    // return new Promise((ls => (resolve, reject) => {
    //     let result = '';
    //     ls.stdout.on('data', (data) => {
    //         result += data;
    //         console.log(`输出：${data}`);
    //     });

    //     ls.stderr.on('data', (data) => {
    //         console.log(`错误：${data}`);
    //     });

    //     ls.on('close', (code) => {
    //         resolve(result);
    //         console.log(`子进程退出码：${code}`);
    //     });
    // })(ls));

}

// 请求页面
function fetchPage(url) {
    return new Promise((resolve, reject) => {
        return usePhantomjs(url)
        .then(result => {
            resolve(result);
        })

        // let httpOrHttps = /^https/.test(url) ? https : http;

        // httpOrHttps.get(url, function(res) {
        //     let html = '';

        //     // 获取页面数据
        //     res.on('data', function(data) {
        //         html += data.toString('utf-8');
        //     });

        //     // 数据获取结束
        //     res.on('end', function() {
        //         resolve(html);
        //     });
        // }).on('error', function(e) {
        //     reject({
        //         type: 'fetchError',
        //         data: e
        //     })
        // });

    });
}

// 解析页面正文内容
function analyzePageContent(html, parser) {
    // let $ = cheerio.load(html);

    // parser return {title, content}
    return parser(cheerio(html));
}

// 爬取流程
function crawl(reqUrl) {
    let url = new URL(reqUrl);
    let opt = websiteOpts[Symbol.for(url.hostname + url.pathname.replace(/\/[^\/]*$/, ''))];

    if (opt) {
        return fetchPage(reqUrl)
        .then(result => {
            return analyzePageContent(result, opt.pageParser);
        });
    }

    console.log(url.pathname.replace(/\/[^\/]*$/, ''));

    return new Promise((resolve, reject) => {
        reject({
            type: 'noOpts',
            data: reqUrl
        })
    })
}

module.exports = crawl;