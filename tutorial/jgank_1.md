## 写在前面
最近突然想学下小程序，说不定以后会用的到，就算用不到，也能在简历上多添一笔（哈哈...）。最好的学习方式当然是以实战项目驱动，所以我打算用 [gank.io（干货集中营）](http://gank.io/)的 [api](http://gank.io/api) 数据做一个小程序，刚好界面也直接照搬了，懒得自己设计，毕竟我对自己的审美认知还是很到位的，哈哈～    

先看官方的效果
![](http://os6ycxx7w.bkt.clouddn.com/images/345cd5c1-715f-464c-8a89-1f97317f999f.gif)

整体可以看作两部分，上面是显示分类的选项卡，下面就是具体分类的内容了，然后内容又有三种布局，推荐（混合布局），福利（两列图片），其他分类（普通文字）。
## 准备
首先要先有一个微信公众平台的开发者账号，去[官网](https://mp.weixin.qq.com/)注册，账号类型选择『小程序』。
> 这里要吐槽下，如果你之前用邮箱注册了订阅号的开发或者注册了微信开放平台，那就不能用这个邮箱了，意思就是如果你同时需要开发公众号，小程序，还需要使用微信开放平台（微信登录，支付，分享等等），那你就要用三个邮箱！！！不知道微信为什么要这么搞，反正作为一个用户来说，我用着很不爽。  

注册完账号后，跟着提示一步一做就行了，最后就是下载微信的小程序开发工具进行开发。  

上面的都搞定了后就开始看官方文档吧，文档还是挺详细的，把 简易教程，框架，先看一遍，组件 和 API 打开看下有哪些东西，看完后就可以开始撸代码了（文档不是很多啦，不要虚）。
## 开始
首先做一下全局的配置信息。  
样式只有一个，就是所有页面高度百分百：
app.wxss
``` css
page {
  height: 100%;
}
```
然后是主题颜色，页面等信息的配置：
app.json
``` json
{
  "pages": [
    "pages/index/index"
  ],
  "window": {
    "navigationBarTitleText": "Jgank",
    "backgroundColor": "#088",
    "navigationBarBackgroundColor": "#088",
    "backgroundTextStyle": "dark"
  },
  "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  },
  "debug": true
}
```
从配置信息可以看出，我们有一个页面 `pages/index/index`。  

## 选项卡
先完成上面的选项卡部分，选项卡是一个横向的可以拖动的列表，看下官方文档的组件部分可以发现，`scroll-view` 可以实现该效果，看下代码：
index.wxml
``` xml
<scroll-view class="scroll-view_H" scroll-x="true" style="width: 100%">
  <view wx:for="{{classify}}" wx:key="id" data-type="{{item.id}}"  class="scroll-view-item_H {{curTab==item.id?'sv-item-on':'sv-item-off'}}" bindtap="classifyClick">
    {{item.name}}
  </view>
</scroll-view>
```
对应的样式：
index.wxss
``` css
.scroll-view_H{
  white-space: nowrap;
}

.scroll-view-item_H{
  display: inline-block;
  line-height: 80rpx;
  width: 180rpx;
  text-align: center;
}

.sv-item-on{
  background-color: #0aa;
  color: #ddd;
}

.sv-item-off{
  background-color: #088;
  color: #fff;
}
```
对应的业务逻辑;
index.js
``` javascript
Page({
  data:{
    classify: [{ id: 0, name: "推荐" }, 
    { id: 1, name: "福利" }, 
    { id: 2, name: "Android" }, 
    { id: 3, name: "ios" },
    { id: 4, name: "休息视频" }, 
    { id: 5, name: "拓展资源" }, 
    { id: 6, name: "前端" }],
    curTab: 0
  },
  classifyClick:function(e){
	//判断如果点击的是当前的选项卡则不做任何处理
    if (this.data.curTab == e.currentTarget.dataset.type){
      return
    }
    console.log("切换")
    this.setData({
      curTab: e.currentTarget.dataset.type
    })
  }
})
```
`classify` 就是所有的分类，用来和页面进行数据绑定，`curTab` 用来记录当前选项卡的 `id` ，`classifyClick` 用来监听选项卡的点击事件，点击不同的选项卡，就修改 `curTab` 为对应的值，页面上通过判断 `curTab` 的变化来显示不同的内容。  
所以页面上再添加如下代码：
index.wxml
``` xml
<scroll-view class="scroll-view_H" scroll-x="true" style="width: 100%">
  <view wx:for="{{classify}}" wx:key="id" data-type="{{item.id}}"  class="scroll-view-item_H {{curTab==item.id?'sv-item-on':'sv-item-off'}}" bindtap="classifyClick">
    {{item.name}}
  </view>
</scroll-view>

<block wx:if="{{curTab ==0}}"> {{classify[curTab].name}} </block>
<block wx:elif="{{curTab==1}}"> {{classify[curTab].name}} </block>
<block wx:elif="{{curTab==2}}"> {{classify[curTab].name}} </block>
<block wx:elif="{{curTab==3}}"> {{classify[curTab].name}} </block>
<block wx:elif="{{curTab==4}}"> {{classify[curTab].name}} </block>
<block wx:elif="{{curTab==5}}"> {{classify[curTab].name}} </block>
<block wx:else> {{classify[curTab].name}} </block> 
```
下面看下效果：
![](http://os6ycxx7w.bkt.clouddn.com/images/0c754b1a-0a9b-472a-a7cc-9d46ec36e848.gif)

这次就先完成选项卡功能，内容部分下次在说。
