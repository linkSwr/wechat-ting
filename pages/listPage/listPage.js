var order = ['red', 'yellow', 'blue', 'green', 'red'];

/*
    点击添加添加文章
    把添加的文章记录存储到微信本地
    server需要提供一个服务来存储用户的信息
    事件控制包括：
    播放，暂停，三秒前，三秒后
*/

Page({
    data: {
        toView: 'red',
        scrollTop: 100,
        ctrPlay: '播放',
        playState: 'pause',
        articles: [
            {
                title: '测试文章1',
                author: 'webpage',
                totalTime: '7:30',
                percent: '35%'
            },
            {
                title: '测试文章2',
                author: 'webpage',
                totalTime: '7:30',
                percent: '35%'
            },
            {
                title: '测试文章3',
                author: 'webpage',
                totalTime: '7:30',
                percent: '35%'
            },
            {
                title: '测试文章4',
                author: 'webpage',
                totalTime: '7:30',
                percent: '35%'
            },
            {
                title: '测试文章5',
                author: 'webpage',
                totalTime: '7:30',
                percent: '35%'
            },
            {
                title: '测试文章6',
                author: 'webpage',
                totalTime: '7:30',
                percent: '35%'
            },
            {
                title: '测试文章2',
                author: 'webpage',
                totalTime: '7:30',
                percent: '35%'
            },
            {
                title: '测试文章3',
                author: 'webpage',
                totalTime: '7:30',
                percent: '35%'
            },
            {
                title: '测试文章4',
                author: 'webpage',
                totalTime: '7:30',
                percent: '35%'
            },
            {
                title: '测试文章5',
                author: 'webpage',
                totalTime: '7:30',
                percent: '35%'
            },
            {
                title: '测试文章6',
                author: 'webpage',
                totalTime: '7:30',
                percent: '35%'
            }
        ]
    },
    onLoad: function (e) {
         console.log(wx.getStorageSync('pagesList'));
    },
    upper: function(e) {
        console.log(e)
    },
    lower: function(e) {
        console.log(e)
    },
    scroll: function(e) {
        console.log(e)
    },
    clickItemHandle: function (e) {
        // 点击单条文章事件处理
    },
    addHandle: function (e) {
        // 添加文章到阅读事件处理
    },
    playOrPauseHandle: function (e) {
        // 控制播放和暂停事件处理
    },
    nextHandle: function (e) {
        // 播放下一篇事件处理
    },
    settingHandle: function (e) {
        // 跳转设置页面事件处理
    }
})