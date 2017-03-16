let Observer =  require('./Observer')
let Compile = require('./Compile')
// Vue
function Vue(option) {
  this.el = document.querySelector(option.el)
  this._data = option.data
  this._directives = []
  this.init()
}

Vue.prototype.init = function() {
  new Observer(this._data, this)
  new Compile(this.el, this)
}

module.exports = Vue
