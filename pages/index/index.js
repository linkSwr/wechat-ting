// this.setData({ msg: "Hello World" })

Page({
  data: { // 参与页面渲染的数据
    msg: 'Hello World!'
  },
  onLoad: function () {
    // 页面渲染后 执行
    this.setData({ msg: "Hello World - 1!" });
    wx.getLocation({
        type: 'wgs84',
        success: (res) => {
            var latitude = res.latitude // 经度
            var longitude = res.longitude // 纬度
            this.setData({
                latitude: latitude,
                longitude: longitude
            })

            console.log(latitude, longitude)
        }
    })
  }
})