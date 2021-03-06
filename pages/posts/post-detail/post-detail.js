var postsData = require("../../../data/posts-data.js");
var app = getApp();
Page({
  data: {
    currentId: '',
    isplaying: false
  },

  onLoad: function (options) {
    var postId = options.id;
    this.data.currentId = postId;
    var postData = postsData.postList[postId]
    this.setData({
      postData: postData
    })
    //从缓存中获取存储的对象，键为collect_Info,
    var collectInfo = wx.getStorageSync('collect_Info');
    //逻辑判断
    if (collectInfo) {
      //处理逻辑放在外面了
      if (!collectInfo[postId]) {
        collectInfo[postId] = false
      }
    } else {
      //如果尚未存在，则创建对象，依据postID,设置完成后存入缓存
      var collectInfo = {}
      collectInfo[postId] = false
    }
    //缓存处理以及设置当前页面的data
    wx.setStorageSync('collect_Info', collectInfo)
    this.setData({
      collected: collectInfo[postId]
    })
    //播放设置
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isplaying: true
      })
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isplaying: false
      })
    })
    if (app.globalData.g_isplaying && app.globalData.g_currentpostId == postId) {
      this.setData({
        isplaying: true
      })
    }
    this.setAudio();
  },

  setAudio: function (event) {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isplaying: true
      })
      app.globalData.g_isplaying = true
      app.globalData.g_currentpostId = that.data.currentId;
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isplaying: false
      })
      app.globalData.g_isplaying = false
      app.globalData.g_currentpostId = null;
    })
  },

  collectTap: function (event) {
    //获取当前缓存中的值
    var collectInfo = wx.getStorageSync('collect_Info')
    var now = !collectInfo[this.data.currentId]
    //设置进入对象并放入缓存，然后再设置自身的collected
    collectInfo[this.data.currentId] = now;
    wx.setStorageSync('collect_Info', collectInfo)
    this.setData({
      collected: now
    })
    this.tapToast()
  },

  tapToast: function (event) {
    var now = wx.getStorageSync('collect_Info')[this.data.currentId]
    wx.showToast({
      title: now ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    })
  },

  onShareTap: function (event) {
    wx.showActionSheet({
      itemList: [
        '分享给微信好友',
        '分享到朋友圈',
        '分享到微博',
      ],
      itemColor: '#405f80',
      success: function (res) {

      }
    })
  },

  onMusicTap: function (event) {
    var isplaying = this.data.isplaying
    if (isplaying) {
      wx.pauseBackgroundAudio()
      this.setData({
        isplaying: false
      })
      console.log('暂停')
    } else {
      wx.playBackgroundAudio({
        dataUrl: postsData.postList[this.data.currentId].music.url,
        title: postsData.postList[this.data.currentId].music.title,
        coverImgUrl: postsData.postList[this.data.currentId].coverImg,
      })
      this.setData({
        isplaying: true
      })
      console.log('播放')
    }
  },
})