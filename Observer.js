let getRoute = require('./Utils').getRoute
let Dep = require('./Dep')

/**
 * 对传入的数据对象进行监听, 如有变动更新数据并通知订阅者
 * @param {[Object]} data
 * @param {[Object]} vm
 * @param {Array} parents
 */
function Observer(data, vm, parents = []) {
  this._data = data
  this.vm = vm
  this.walk(this._data, parents)
}

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

Observer.prototype.convert = function(key, val, parents) {
  let self = this
  let target = parents == [] ? this._data : getRoute(this._data, parents)
  let dep = new Dep()
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      console.log('你访问了 ' + key)
      if (Dep.target) {
        dep.depend()
      }
      return val;
    },
    set: function (newVal) {
      console.log('你设置了 ' + key + ', 新的值为' + newVal)
      if(newVal == val) return
      val = newVal
      dep.notify()
      if (typeof val === 'object') {
        return self.walk(val, [key].concat(parents))
      }
    }
  })
}

module.exports = Observer
