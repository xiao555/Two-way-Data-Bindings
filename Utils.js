exports.getValue = function getValue(route, obj) {
  let keys = route.match(/(\w+\.?)+/g)[0].split('.')
  let value = obj
  for (var i = 0;i < keys.length;i++) {
    value = value[keys[i]]
  }
  return value
}

exports.setValue = function setValue(val, route, obj) {
  let keys = route.match(/(\w+\.?)+/g)[0].split('.')
  for (var i = 0;i < keys.length - 1;i++) {
    obj = obj[keys[i]]
  }
  obj[keys[i]] = val
}

exports.getRoute = function getRoute(obj, arr) {
  let value = obj
  for (var i = arr.length - 1;i >= 0;i--) {
    value = value[arr[i]]
  }
  return value
}

exports.toArray = function toArray(list) {
  var l = list.length
  var ret = new Array(l)
  while (l--) {
    ret[l] = list[l]
  }
  return ret
}
