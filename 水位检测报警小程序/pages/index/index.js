// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  start:function(e)
  {
    wx.navigateTo({
      url: '../gauge/index',
    })
  }
})