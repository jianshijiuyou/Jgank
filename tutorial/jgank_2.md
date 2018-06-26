
## 开始

今天完成了 推荐列表页面 和 复制链接页面，先看下效果吧：  
![](http://os6ycxx7w.bkt.clouddn.com/github/Jgank/jgank_2_1.gif)

## 数据

先说数据部分，推荐列表的数据接口是 `https://gank.io/api/day/2017/08/31`，后面的日期可以改变的，想获取哪一天的推荐就用哪一天的日期。
> 这里要说下，并不是每一天的日期都有数据返回哟，所以要先用接口 `https://gank.io/api/day/history` 获取到有数据的日期列表，然后用最新的日期去获取最新的推荐数据。  
>（吐槽）奇葩的接口设计，难道服务器就不能自动返回距离请求日期最近的日期推荐数据吗，还是说只是我没发现这个接口～  

我是在页面初次渲染完成时请求数据的：  
先请求有数据的日期列表
``` javascript
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
  }
```
再请求具体日期的推荐数据：
``` javascript
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
  }
```
把请求到的数据设置到 data 中，页面根据数据再渲染：

## 视图
视图我单独放到一个 wxml 文件中，在主页面再 include 进来，这样看起来舒服点。

推荐页可以看成两部份，最上面的福利图和下面的各大分类板块，而各大板块的布局是一样的，所以一个 for 循环就搞定了：  
``` xml
<image src="{{recommend['福利'][0].url}}" mode="aspectFill" class="recommend_head" bindtap="imgClick" data-img-url="{{recommend['福利'][0].url}}"></image>

<block wx:for="{{recommend}}" wx:for-item="rItem">
  <block wx:if="{{rItem[0].type!='福利'}}">
    <view class="recommend_title theme-color">{{rItem[0].type}}</view>
      <view wx:for="{{rItem}}" wx:key="_id" class="list_item" bindtap="itemClick" data-url="{{item.url}}">
        <view>{{item.desc}}</view>
        <view wx:if="{{item.images}}"> 
          <image src="{{item.images[0]+'?imageView2/0/w/200'}}" mode="aspectFit" catchtap="imgClick" data-img-url="{{item.images[0]}}"></image>
        </view>
        <view class="who">{{item.who}}</view>
      </view>
  </block>
</block>
```
各大板块用的双 for 循环，外层循环分类，内层循环具体类别的列表，而分类的标题是通过类别第一项数据的 type 项获得的。
> 注意，这里要做一下判断，把福利分类去除掉，不显示，因为福利分类我们只要那张图，且要放在最上面。

然后就是设置图片和列表的点击事件，当然是用微信的 api 查看图片，点击列表是跳转到复制链接的页面，因为小程序是无法打开网页链接的。  
**注意，图片的点击事件用的是 `catchtap` 而不是 `bindtap` ，如果用后者，点击图片后不仅会触发图片的点击事件，还会触发列表的点击事件，所以这里用前者可以把事件拦截下来，禁止继续往外冒泡传递。**
> 小程序不能打开网页链接.....难道是怕别人再用小程序做个小小程序吗....哈哈

``` javascript
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
```

样式部分的代码就不贴上来了，反正就是 css 那些东西，至于复制链接的页面也就一个复制的功能，大家自家看就好啦，今天的源码我打了一个 tag 方便大家查看。  

代码地址：[https://github.com/jianshijiuyou/Jgank/tree/v0.1](https://github.com/jianshijiuyou/Jgank/tree/v0.1)
