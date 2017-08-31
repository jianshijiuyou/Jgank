Page({
  data:{
    recommend: null,
    classify: [{ id: 0, name: "推荐" }, 
    { id: 1, name: "福利" }, 
    { id: 2, name: "Android" }, 
    { id: 3, name: "ios" },
    { id: 4, name: "休息视频" }, 
    { id: 5, name: "拓展资源" }, 
    { id: 6, name: "前端" }],
    curTab: 0
  },
  onReady:function(){
    var page = this
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    wx.request({
      url: encodeURI('https://gank.io/api/day/history'), 
      method:"GET",
      success: function (res) {
        
        var url = "https://gank.io/api/day/"+res.data.results[0].replace(/-/g, "/")
        page.requestRecommend(encodeURI(url))
      },
      fail:function(){
        wx.hideLoading()
      }
    })
  },
  classifyClick:function(e){
    if (this.data.curTab == e.currentTarget.dataset.type){
      return
    }
    this.setData({
      curTab: e.currentTarget.dataset.type
    })
  },
  requestRecommend:function(url){
    var page = this
    wx.request({
      url: url,
      method: "GET",
      success: function (res) {
        wx.hideLoading()
        page.setData({
          recommend: res.data.results
        })
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  },
  imgClick:function(e){
    var url = e.currentTarget.dataset.imgUrl
    wx.previewImage({
      urls: [url] 
    })
  },
  itemClick:function(e){
    var url=e.currentTarget.dataset.url
    wx.navigateTo({
      url: "../copylink/copylink?url=" + url
    })
  }
})