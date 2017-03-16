let getValue = require('./Utils').getValue
let setValue = require('./Utils').setValue
let Dep = require('./Dep')

function Watcher(descriptor, vm, el) {
  this.vm = vm
  this.el = el
  this.name = descriptor.name
  this.expression = descriptor.exp
  this.update = descriptor.def.update
  this.bind = descriptor.def.bind
  this.dep = []
  this.depId = {}
  this._init()
  
}

Watcher.prototype._init = function() {
  this.value = this.get()
  this.update(this.value)
  this.bind()
}

Watcher.prototype.get = function() {
  Dep.target = this
  let value = getValue(this.expression, this.vm._data)
  Dep.target = null
  return value
}

Watcher.prototype.set = function(value) {
  setValue(value, this.expression, this.vm._data)
  // console.log(getValue(this.expression, this.vm._data))
}

Watcher.prototype.addDep = function(dep) {
  let id = dep.id
  if(!this.depId[id]) {
    dep.addSub(this)
    this.dep.push(dep)
    this.depId[id] = true
  }
}

Watcher.prototype._update = function() {
  let value = this.get()
  if(value !== this.value) {
    this.value = value
    this.update(value)
  }
}

Watcher.prototype.on = function (event, handler) {
  this.el.addEventListener(event, handler, false)
}

module.exports = Watcher