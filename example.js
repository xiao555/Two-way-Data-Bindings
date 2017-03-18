function Vue(opt) {
  this.el = document.querySelector(opt.el)
  this.data = opt.data
  this.model = {}
  this.text = {}
  this._init()
}

Vue.prototype._init = function() {
  this.walk(this.data)
  this.bindNode(this.el)
}

Vue.prototype.walk = function(data) {
  let keys = Object.keys(data)
  for (var i = keys.length - 1; i >=0; i--) {
    let val = data[keys[i]]
    this.convert(keys[i], val)
  }
}

Vue.prototype.convert = function(key, val) {
  let self = this;
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      console.log('你访问了 ' + key);
      return val;
    },
    set: function (newVal) {
      console.log('你设置了 ' + key + ', 新的值为' + newVal);
      if(newVal === val) return;
      val = newVal;
      self.model[key].value = val
      self.text[key].textContent = val
    }
  })
}

Vue.prototype.bindNode = function(node) {
  switch(node.nodeType) {
    // node
    case 1:
      this.splitElement(node)
      break
    // text
    case 3:
      this.handleText(node)
      break
    default:
      return
  }
}

Vue.prototype.splitElement = function(node) {
  console.log(node)
  if (node.tagName === 'INPUT' && node.hasAttribute('v-model')) {
    console.log('find a input')
    this.handleNode(node) 
  }
  if(node.hasChildNodes()) {
    Array.from(node.childNodes).forEach(this.bindNode, this)
  }
}

Vue.prototype.handleNode = function(node) {
  let exp = node.getAttribute('v-model').trim() // name
  let val = this.data[exp]
  let self = this
  this.model[exp] = node
  node.value = val
  node.addEventListener('input', function() {
    self.data[exp] = node.value
  })

}

Vue.prototype.handleText = function(node) {
  console.log(node.nodeValue)
  let regTag = /{{(.*?)}}/g
  if(!regTag.test(node.nodeValue)) return
  regTag.lastIndex = 0
  let result = regTag.exec(node.nodeValue)
  let value = result[1].trim()
  let frag = document.createDocumentFragment()
  let el = document.createTextNode(this.data[value])
  frag.appendChild(el)
  this.text[value] = el
  node.parentNode.replaceChild(frag, node)
}

window.Vue = Vue
