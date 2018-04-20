var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var douban = app.globalData.doubanBase;
    var inTheatersUrl = douban + "/v2/movie/in_theaters";
    var comingSoonUrl = douban + "/v2/movie/coming_soon";
    var top250 = douban + "/v2/movie/top250";
    this.getMovieListData(inTheatersUrl);
    // this.getMovieListData(comingSoonUrl);
    // this.getMovieListData(top250);

  },
  getMovieListData: function (url) {
    var that =this;
    wx.request({
      url: url,
      data: {
        "start": 0,
        "count": 3
      },
      method: "GET",
      success: function (res) {
        // console.log(res)
        that.processDoubanData(res.data)
      }
    })
  },
  processDoubanData:function(doubanData){
    var movies=[]
    for(var i in doubanData.subjects){
      var subject = doubanData.subjects[i]
      var title = subject.title
      title = title.length>=6?title.substring(0,6)+"...":title      
      var temp={
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id
      }
      movies.push(temp)
    }
    this.setData({
      movies:movies
    })
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