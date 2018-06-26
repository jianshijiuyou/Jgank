今天再水最后一篇，福利列表和其他页面的完成，其他的页面可以看成一类页面，就是单一的图文列表。  

## 福利页面
试图上很简单，就一个 scroll-view 而已：
``` xml
<scroll-view scroll-y="true" class="img-list">
 <image wx:for="{{welfare}}" class="welfare-img-item" src="{{item.url}}" mode="aspectFill" bindtap="imgListClick" data-url="{{item.url}}"></image>
</scroll-view>
```
因为要显示成两列，所以需要把图片的宽度设置成 50% ，这样每行就是两张图片了，具体操作可以看源码。

## 其他页面
剩下的页面布局中的图文和推荐页面的图文实际是一样的布局，所以可以直接照搬：
``` xml
<view wx:for="{{other}}" wx:key="_id" class="list_item" bindtap="itemClick" data-url="{{item.url}}">
      <view>{{item.desc}}</view>
      <view wx:if="{{item.images}}">
        <image src="{{item.images[0]+'?imageView2/0/w/200'}}" mode="aspectFit" catchtap="imgClick" data-img-url="{{item.images[0]}}"></image>
      </view>
      <view class="who">{{item.who}}</view>
</view>
```
## 分页
分页是真的遇到坑了，分页其实有两种方法，一种是用 scroll-view 的 bindscrolltolower 事件触发滚动到底部刷新，一种是用 page 的 onReachBottom 事件触发滚动到底部刷新。  

如果是用 bindscrolltolower ，必须要给 scroll-view 设置个固定高度，不然无法触发事件，也只有设置了固定高度后，scroll-top 属性才有效，但但但是，我在测试的时候 bindscrolltolower 事件会多次触发，所以我最后选择用 onReachBottom 了。  

如果用了 scroll-view 并设置了固定高度，是不会触发 onReachBottom 事件的....，所以我最后直接用的最简单的 view 控件的 循环。  

请求分页的时候用一个变量 curPage 来记录当前页面共请求了几页数据，每次请求刷新，就给 curPage 加 1 ，当页面切换时 curPage 重新设置为 1。  

福利页的数据请求和其他页的数据请求，我是分开的，因为两者对应的视图上绑定的变量是不一样的。

这里就只放上请求其他页数据的代码：  
rtype：请求的类型，是 android 还是 ios，前端等...  
pageNumber：请求的页数
``` javascript
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
          other: page.data.other.concat(res.data.results)
        })
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  }
```

最后看下整个效果吧  
![](http://os6ycxx7w.bkt.clouddn.com/github/Jgank/github_jgank_readme_1.png)  
