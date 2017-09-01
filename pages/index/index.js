Page({
  data:{
    other:[],
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
    
    if (this.data.curTab == e.currentTarget.dataset.type) {
      return
    } 

    var page = this

    this.setData({
      curTab: e.currentTarget.dataset.type,
      curPage: 1,
      other:[]
    })

    if (e.currentTarget.dataset.type==1){
      //请求福利数据
      this.requestData("https://gank.io/api/data/福利/10/1", function (res) {
        wx.hideLoading()
        page.setData({
          welfare: res.data.results
        })
      })
    } else if (e.currentTarget.dataset.type == 2){
      //请求android数据
      this.reqeustOtherData("Android",1)
    } else if (e.currentTarget.dataset.type == 3) {
      this.reqeustOtherData("iOS", 1)
    } else if (e.currentTarget.dataset.type == 4) {
      this.reqeustOtherData("休息视频", 1)
    } else if (e.currentTarget.dataset.type == 5) {
      this.reqeustOtherData("拓展资源", 1)
    } else if (e.currentTarget.dataset.type == 6) {
      this.reqeustOtherData("前端", 1)
    }
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
  },
  requestData:function(url,callback){
    var url = encodeURI(url)
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    wx.request({
      url: url,
      method: "GET",
      success: callback,
      fail: function () {
        wx.hideLoading()
      }
    })
  },
  reqeustOtherData:function(rtype,pageNumber){
    var page=this
    var url = encodeURI("https://gank.io/api/data/" + rtype + "/10/" + pageNumber)
    
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    wx.request({
      url: url,
      method: "GET",
      success: function (res) {
        wx.hideLoading()
        page.setData({
          other: page.data.other.concat(res.data.results),
          scrollTop: 0
        })
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  },
  imgListClick:function(e){
    var url = e.currentTarget.dataset.url

    var list = new Array()
    for (var i = 0;i<this.data.welfare.length;i++){
      list[i] = this.data.welfare[i].url
    }

    wx.previewImage({
      current: url,
      urls: list // 需要预览的图片http链接列表
    })
  },
  onReachBottom:function(){
    console.log("==========onReachBottom========" + this.data.curTab)

    if(this.data.curTab==0){
      return
    }


    var page = this
    this.data.curPage = this.data.curPage+1
    if (this.data.curTab == 1) {
      //请求福利数据
      this.requestData("https://gank.io/api/data/福利/10/" + this.data.curPage, function (res) {
        wx.hideLoading()
        page.setData({
          welfare: page.data.welfare.concat(res.data.results)
        })
      })
    } else if (this.data.curTab == 2) {
      //请求android数据
      this.reqeustOtherData("Android", this.data.curPage)
    } else if (this.data.curTab == 3) {
      this.reqeustOtherData("iOS", this.data.curPage)
    } else if (this.data.curTab == 4) {
      this.reqeustOtherData("休息视频", this.data.curPage)
    } else if (this.data.curTab == 5) {
      this.reqeustOtherData("拓展资源", this.data.curPage)
    } else if (this.data.curTab == 6) {
      this.reqeustOtherData("前端", this.data.curPage)
    }
  }
})