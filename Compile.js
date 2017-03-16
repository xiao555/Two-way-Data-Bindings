let Watcher = require('./Watcher')
let toArray = require('./Utils').toArray
let directives = require('./directives')

function Compile(el, vm) {
  this.el = el
  this.vm = vm
  this.analyElement(el)
}

// 开始分析节点
Compile.prototype.analyElement = function(node) {
  switch(node.nodeType) {
    // node
    case 1:
      this.splitElement(node)
      break
    // text
    case 3:
      this.replaceElement(node)
      break
    default:
      return
  }
}
// 找出子节点
Compile.prototype.splitElement = function(node) {
  if (node.tagName === 'INPUT' && node.hasAttribute('v-model')) {
    let exp = node.getAttribute('v-model').trim()
    let descriptor = {
      name: 'model',
      exp: exp,
      def: directives.model
    }
    this.vm._directives.push(new Watcher(descriptor, this.vm, node))
    return 
  }
  if(node.hasChildNodes()) {
    Array.from(node.childNodes).forEach(this.analyElement, this)
  }
}
// 用 DocumentFragment 替换 TextNode
Compile.prototype.replaceElement = function (node) {
  let self = this
  let text = node.nodeValue
  let regTag = /{{(.*?)}}/g
  if(!regTag.test(text)) return
  let tokens = this.getTokens(regTag, text)
  
  let frag = document.createDocumentFragment()
  tokens.forEach(function(token) {
    let el = token.tag ? self.processTextToken(token) : document.createTextNode(token.value)
    frag.appendChild(el)
  })
  let fragClone = frag.cloneNode(true)
  let childNodes = toArray(fragClone.childNodes)
  tokens.forEach(function (token, i) {
    let value = token.value
    if (token.tag) {
      let cnode = childNodes[i]
      self.vm._directives.push(new Watcher(token.descriptor, self.vm, cnode))
    }
  })
  node.parentNode.replaceChild(fragClone, node)
}

Compile.prototype.getTokens =  function getTokens(regTag, text) {
  let lastIndex = regTag.lastIndex = 0
  let index, value, matchs, tokens = []
  while(matchs = regTag.exec(text)) {
    index = matchs.index
    if(index > lastIndex) {
      tokens.push({
        value: text.slice(lastIndex, index)
      })
    }
    value = matchs[1]
    tokens.push({
      tag: true,
      value: value.trim()
    })
    lastIndex = index + matchs[0].length
  }
  if(lastIndex < text.length) {
    tokens.push({
      value: text.slice(lastIndex)
    })
  }
  return tokens
}

Compile.prototype.processTextToken = function processTextToken(token) {
  let el = document.createTextNode(' ')
  // 简化，双向绑定，text 模式
  token.descriptor = {
    name: 'text',
    exp: token.value,
    def: directives.text
  }
  return el
}

module.exports = Compile