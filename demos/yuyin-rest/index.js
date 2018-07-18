var AipSpeechClient = require("baidu-aip-sdk").speech;
var HttpClient = require("baidu-aip-sdk").HttpClient;
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var args = process.argv.slice(2);
// 设置APPID/AK/SK
var APP_ID = args[0];
var API_KEY = args[1];
var SECRET_KEY = args[2];
// 新建一个对象，建议只保存一个对象调用服务接口
var client;


// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
// HttpClient.setRequestOptions({timeout: 5000});
// 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
// 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
// request参数请参考 https://github.com/request/request#requestoptions-callback
// HttpClient.setRequestInterceptor(function(requestOptions) {
//     // 查看参数
//     console.log(requestOptions)
//     // 修改参数
//     requestOptions.timeout = 5000;
//     // 返回参数
//     return requestOptions;
// });

let pers = [0, 1, 3, 4];

// pers.forEach(per => {
//     // 语音合成, 附带可选参数
//     client.text2audio('百度语音合成测试', {spd: 5, per: per}).then(function(result) {
//         if (result.data) {
//             fs.writeFileSync(path.join(__dirname, `./mp3/tts.mpVoice-${per}.mp3`), result.data);
//         } else {
//             // 服务发生错误
//             console.log(result)
//         }
//     }, function(e) {
//         // 发生网络错误
//         console.log(e)
//     });
// });

function parseThunk(text, url, thunId = 0) {

    return new Promise(function(resolve, reject) {
        client.text2audio(text, {spd: 5}).then(function(result) {
            console.log('---->url', url)
            let urlHash = crypto.createHash('md5').update(url).digest('hex').slice(-10);
            if (result.data) {
                fs.writeFileSync(path.join(__dirname, `./mp3/tts.${urlHash}-${thunId}.mp3`), result.data);
                resolve({
                    urlHash,
                    thunId,
                    fileName: `tts.${urlHash}-${thunId}.mp3`
                });
            } else {
                // 服务发生错误
                console.log(result)
                reject(result);
            }
        }, function(e) {
            // 发生网络错误
            console.log(e);
            reject(e);
        });
    })
}

// 分割需要转换的文本
function splitText(text) {
    const thunkLength = 500;
    let result = [];
    let textLenth = text.length;

    let index = 0;

    while(index < textLenth) {
        result.push(text.slice(index, index + thunkLength));

        index += thunkLength;
    }

    return result;
}

module.exports = function (text, url, opts) {
    // 分割需要处理的文本
    // 循环转换需要处理的text thunk

    if (text) {
        let promises = [];
        let {APP_ID, API_KEY, SECRET_KEY} = opts;
        if (!client) {
            client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);
            HttpClient.setRequestOptions({timeout: 5000});
        }

        splitText(text).forEach((item, index) => {
           promises.push(parseThunk(item, url, index));
        });

        return Promise.all(promises);
    }

    return Promise.reject(new Error('No Text!'));
}
