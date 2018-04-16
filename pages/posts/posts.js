var postData = require("../../data/posts-data.js")

Page({
  data: {
    post_key: []
  },
  onPostTap:function(event){
    //下面可以获取自定义属性
    // console.log(event.currentTarget.dataset.postid)
    wx.navigateTo({
      url: 'post-detail/post-detail'
    })
  },
  onLoad: function (options) {
    
    this.setData({
      post_key:postData.postList
    })
  }
})