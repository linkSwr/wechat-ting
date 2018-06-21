const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

// 其他说明：
// 微信登录生成的登录token有效期是30天
// 所以如果用个人号的话需要定期维护性登录
// 并且因为小程序提供的用户id和微信聊天的用户id是不能对应起来的所以可能会出现无法关联的情况，需要测试验证

// step1: 获取微信请求需要的cookie和相关header信息
new Promise((resolve, reject) => {
    https.get('https://wx.qq.com', (res) => {
        // console.log('statusCode:', res.statusCode);
        // console.log('res headers:', res.headers);

        res.on('data', (d) => {
            // process.stdout.write(d);
        });

        res.on('end', result => {
            resolve(result);
        });
    }).on('error', (e) => {
        console.error(e);
    });
})
.then(result => {
    // step2: 获取二维码登录需要的uuid，获取到的二维码需要写入到本地并且使用手机扫码
    const querys = querystring.stringify({
        appid: 'wx782c26e4c19acffb',
        redirect_uri: 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage',
        fun: 'new',
        lang: 'zh_CN',
        _: new Date().valueOf()
    });

    return new Promise((resolve, reject) => {
        https.get('https://login.wx.qq.com/jslogin?' + querys, (res) => {
            // console.log('statusCode:', res.statusCode);
            // console.log('res headers:', res.headers);

            res.on('data', (d) => {
                // process.stdout.write(d);
                // window.QRLogin.code = 200; window.QRLogin.uuid = "wdKIjmacqg==";
                let result = {
                    uuid: ('' + d).match(/(?!")\S+(?=")/g).join('')
                }

                resolve(result);
            });

        }).on('error', (e) => {
            console.error(e);
        });
    });
})
.then(result => {
    // step3: 获取登录二维码保存到本地
    let file = fs.createWriteStream("qrcode.jpg");
    https.get('https://login.weixin.qq.com/qrcode/' + result.uuid, (res) => {
        res.pipe(file);
    }).on('error', (e) => {
        console.error(e);
    });

    return result;
})
.then(result => {
    // step4: 发送请求检查是否已经使用手机扫一扫二维码
    return new Promise((resolve, reject) => {
        function checkLogin(result) {
            let now = new Date().valueOf();
            let querys = querystring.stringify({
                loginicon: true,
                uuid: result.uuid,
                tip: 0,
                r: ~now,
                _: now,
            });

            
            https.get('https://login.wx.qq.com/cgi-bin/mmwebwx-bin/login?' + querys, (res) => {
                // console.log('statusCode:', res.statusCode);
                // console.log('res headers:', res.headers);

                res.on('data', (d) => {
                    process.stdout.write(d);
                    // window.QRLogin.code = 200; window.QRLogin.uuid = "wdKIjmacqg==";
                    let uuid = parseInt(('' + d).match(/(?!")\S+(?=")/g).join(''), 0);
                    let code = ('' + d).match(/\d+/g).join('');
                    
                    if (code === 200) {
                        resolve({
                            code: 200,
                            uuid: uuid
                        })
                    }
                    else {
                        checkLogin(result);
                    }
                });

            }).on('error', (e) => {
                checkLogin(result);
                console.error(e);
            });
        }
    });
})
.then