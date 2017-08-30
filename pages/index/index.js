Page({
  data:{
    list:[],
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
    // var page = this
    // wx.request({
    //   url: 'https://gank.io/api/data/%E7%A6%8F%E5%88%A9/10/1', 
    //   method:"GET",
    //   success: function (res) {
    //     console.log("=========success========")
    //     console.log(res.data)
    //     page.setData({
    //       list: res.data.results
    //     })
    //   }
    // })
  },
  classifyClick:function(e){
    if (this.data.curTab == e.currentTarget.dataset.type){
      return
    }
    console.log("切换")
    this.setData({
      curTab: e.currentTarget.dataset.type
    })
  }
})