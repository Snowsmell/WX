var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    bigData:{}
  },
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
    var DataContainer={};
    DataContainer[settedkey] = {
      movies:movies,
      belongTitle: belongTitle
    }
    this.setData(DataContainer)
  },

  onMoreTap:function(e){
    var belong = e.currentTarget.dataset.belong;
    wx.navigateTo({
      url: '/pages/movies/more-movie/more-movie?belong='+belong,
    })
  },
  onBindFocus:function(event){
    console.log('focue')
  }
})