exports.model = {
  bind: function () {
    let self = this
    this.on('input', function () {
      self.set(self.el.value)
    })
  },
  update: function (value) {
    this.el.value = value
  }
}

exports.text = {
  bind: function() {

  },
  update: function (value) {
    this.el.textContent = value
  }
}
