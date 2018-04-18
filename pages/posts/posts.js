var postData = require("../../data/posts-data.js")

Page({
  data: {
    post_key: []
  },
  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid
    //下面可以获取自定义属性
    // console.log(event.currentTarget.dataset.postid)
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId
    })
  },
  onLoad: function (options) {
    
    this.setData({
      post_key:postData.postList
    })
  },
  swiperTap:function(event){
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId,
    })
  }
})