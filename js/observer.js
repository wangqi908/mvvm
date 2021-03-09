import { Dep } from './watcher.js'
export class Observer {
  constructor (data) {
    this.observeData(data)
  }

  observeData (data) {
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        this.defineReactive(data, key, data[key])
      })
    }
  }

  defineReactive (data, key, value) {
    if (typeof value === 'object') this.observeData(value)
    const dep = new Dep()
    Object.defineProperty(data, key, {
      set: (newValue) => {
        this.observeData(newValue) // 如果newValue是对象 还需要再次设置set/get
        value = newValue
        dep.notify()
      },
      get () {
        const target = Dep.target
        target && dep.addWatcher(target)
        return value
      }
    })
  }
}
