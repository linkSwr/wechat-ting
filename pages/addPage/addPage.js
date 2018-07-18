var parseURL = 'http://swr.net:7777/parse'
var urlReg = /^[a-zA-z]+:\/\/[^\s]*$/;

Page({
    onLoad: function (e) {
        this.setData({msg: 'Page Loaded!'});
    },
    getDataFromClipboard: function(e) {
        wx.getClipboardData({
            success: function(data) {
                // 请求server去解析并返回语音地址
                console.log('getClipboardData', data.data)
                if (urlReg.test(data.data)) {
                    wx.request({
                        url: parseURL, //仅为示例，并非真实的接口地址
                        data: {
                            pageUrl: data.data
                        },
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: function(res) {
                            console.log(res.data)
                            // data == {code, data: {audioUrl, title}}
                            // 获取本地的音频记录列表和插入新的数据
                            var pageList = {list: []};
                            var storageKey = 'pagesList';
                            pageList = wx.getStorageSync(storageKey) || pageList;

                            pageList.list.push(res.data);

                            // 写入本地记录
                            wx.setStorageSync(storageKey, pageList);
                        },
                        fail: function (data) {
                            console.error('request fail', data);
                        }
                    })
                }
            },
            fail: function (data) {
                console.warn('getClipboardData fail:', data);
            }
        })
    }
})