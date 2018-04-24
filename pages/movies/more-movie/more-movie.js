// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require("../../../utils/util.js");
Page({

  data: {
    requestUrl: '',
    totalCount: 0,
    flag: true
  },
  onLoad: function (options) {
    var belong = options.belong
    var dataUrl = app.globalData.doubanBase;
    switch (belong) {
      case '正在热映':
        dataUrl += '/v2/movie/in_theaters'
        break;
      case '即将上映':
        dataUrl += '/v2/movie/coming_soon'
        break;
      case '豆瓣top250':
        dataUrl += '/v2/movie/top250'
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData)

    wx.setNavigationBarTitle({
      title: options.belong,
    })
  },
  //处理返回数据
  processDoubanData: function (doubanData, settedkey, belongTitle) {
    var movies = []
    for (var i in doubanData.subjects) {
      var subject = doubanData.subjects[i]
      var title = subject.title
      title = title.length >= 6 ? title.substring(0, 6) + "..." : title
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.convertToStarsArray(subject.rating.stars),
      }
      movies.push(temp)
    }
    var totalMovies = {}
    totalMovies = movies;
    //利用flag，来设置第二次加载之后将数组合并
    if (this.data.flag) {
      this.data.flag = false
    } else {
      totalMovies = this.data.movies.concat(movies)
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20
    setTimeout(function () {
      wx.hideNavigationBarLoading()
    }, 1000)
    wx.stopPullDownRefresh()
  },
  //滑动底部加载
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  //下拉刷新
  onPullDownRefresh: function (event) {
    this.data.flag = false
    this.data.movies = [];
    this.data.totalCount = 0;
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    util.http(refreshUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  }
})