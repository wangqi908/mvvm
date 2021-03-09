export class Mvvm {
  constructor(options) {
    this.$options = options
    this.$el = options.el ? document.querySelector(options.el) : document.querySelector('body')
    this.$data = options.data

    this.proxyData()
  }

  proxyData() {
    Object.keys(this.$data).forEach(key => {
      Object.defineProperty(this, key, {
        set(newValue) {
          this.$data[key] = newValue
        },
        get() {
          return this.$data[key]
        }
      })
    })
  }
}
