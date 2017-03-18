## A Two-way-Data-Bindings Demo

use [get](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/get) and [set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) of [Object.definePropert](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) like [Vue](https://cn.vuejs.org/)

### 什么是双向数据绑定？

请看[Demo](https://xiao555.github.io/Two-way-Data-Bindings/)

简单点说，就是将数据的变化绑定到UI, 同时UI的变化又和数据同步

### 怎么实现？

#### 1. 简单的实现

拿起键盘就是一把梭？

No, [自上而下设计，自下而上实现](https://www.zhihu.com/question/36426051/answer/151964584?utm_medium=social&utm_source=qq)

[example](./example.js) 

#### 2. 滚雪球

怎么滚?

e.g. 假如传入的data有多级怎么处理？

```js
data: {
  user: {
    name: 'xiao555'
    age: '18'
  }
}
```
这样遍历的时候需要判断val是否是object：(parents的作用？)

```js
Observer.prototype.walk = function(obj, parents) {
  let keys = Object.keys(obj)
  for (var i = keys.length - 1; i >=0; i--) {
    let val = obj[keys[i]]
    if (typeof val === 'object') {
      this.walk(val, [keys[i]].concat(parents))
    }
    this.convert(keys[i], val, parents)
  }
}
```
假如html是这样的怎么滚？`姓名：{{name}}`
假如有多个`{{name}}`怎么办？
...


代码越来越多，不断的滚，最终的实现：

  1. 实现一个数据监听器Observer，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
  2. 实现一个指令解析器Compile，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数
  3. 实现一个Watcher，作为连接Observer和Compile的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图
  4. 实现一个订阅器Dep, 解决多个绑定问题


### 我有哪些感悟？

代码设计--设计模式
[观察者模式](http://www.runoob.com/design-pattern/observer-pattern.html)
订阅器Dep, 反正我是想不出来

对比别人的代码，怎么写出优雅而高性能的代码

```js
// 我的实现
p.walk = function(obj) {
  let val;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      val = obj[key];
      if (typeof val === 'object') {
        new Observer(val);
      }
      this.convert(key, val);
    }
  }
};

// 别人的实现
Observer.prototype.walk = function(obj, parents) {
  let keys = Object.keys(obj)
  for (var i = keys.length - 1; i >=0; i--) {
    let val = obj[keys[i]]
    if (typeof val === 'object') {
      this.walk(val, [keys[i]].concat(parents))
    }
    this.convert(keys[i], val, parents)
  }
}
```
[性能比较](http://jsperf.com/object-keys-foreach-vs-for-in-hasownproperty)

ES6的实现
下一步可以写一个ES6版本的，学习一下新的语法糖，用class声明类，使用箭头函数解决this问题，扩展运算符等等

### 参考

[IFE动态数据绑定系列](http://ife.baidu.com/mentor/detail/id/26)
[剖析Vue原理&实现双向绑定MVVM](https://segmentfault.com/a/1190000006599500)
[javascript实现数据双向绑定的三种方式](http://jixianqianduan.com/frontend-javascript/2015/11/29/js-data-two-ways-binding.html)