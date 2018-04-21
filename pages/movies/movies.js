var util = require("../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bigData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var douban = app.globalData.doubanBase;
    var inTheatersUrl = douban + "/v2/movie/in_theaters";
    var comingSoonUrl = douban + "/v2/movie/coming_soon";
    var top250 = douban + "/v2/movie/top250";
    this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250,"top250","豆瓣top250");

  },
  getMovieListData: function (url,settedkey,belongTitle) {
    var that =this;
    wx.request({
      url: url,
      data: {
        "start": 0,
        "count": 3
      },
      method: "GET",
      success: function (res) {
        that.processDoubanData(res.data, settedkey, belongTitle)
      }
    })
  },
  processDoubanData:function(doubanData,settedkey,belongTitle){
    var movies=[]
    for(var i in doubanData.subjects){
      var subject = doubanData.subjects[i]
      var title = subject.title
      title = title.length>=6?title.substring(0,6)+"...":title      
      var temp={
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id,
        stars: util.convertToStarsArray(subject.rating.stars),
      }
      movies.push(temp)
    }
    //考验到js基础功底的写法
    var DataContainer={};
    console.log(DataContainer);
    //为了方便区分，内部多加了一层，然后再wxml里利用扩展运算符展开得到不同的内容
    DataContainer[settedkey] = {
      movies:movies,
      belongTitle: belongTitle
    }
    //实际相当于每次执行后，给data中添加了一个对象，key为settedkey,value是上面58-60行赋值号右侧的对象
    this.setData(DataContainer)

    // 下面这个是我自己循环的写法,商法data中定义了一个空对象bigData，每次执行后添加一个key对象

    // this.data.bigData[settedkey] = movies;
    // this.setData({
    //   bigData:this.data.bigData
    // })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})