import { Observer } from './observer.js'
import { Compiler } from './compiler.js'
export class Mvvm {
  constructor (options) {
    this.$options = options
    this.$el = options.el ? document.querySelector(options.el) : document.querySelector('body')
    this.$data = options.data

    this.proxyData()

    // eslint-disable-next-line no-new
    new Observer(this.$data)
    // eslint-disable-next-line no-new
    new Compiler(this.$el, this)
  }

  proxyData () {
    Object.keys(this.$data).forEach(key => {
      Object.defineProperty(this, key, {
        set (newValue) {
          this.$data[key] = newValue
        },
        get () {
          return this.$data[key]
        }
      })
    })
  }
}
