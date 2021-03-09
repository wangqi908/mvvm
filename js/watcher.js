/*
  Watcher 观察者
  Observer和Compile之间通信的桥梁
*/

import utils from './utils.js'
export class Watcher {
  constructor (exp, vm, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.oldValue = this.getOldValue()
  }

  getOldValue () {
    Dep.target = this
    const oldValue = utils.getValue(this.exp, this.vm)
    Dep.target = null
    return oldValue
  }

  update () {
    const newValue = utils.getValue(this.exp, this.vm)
    this.cb(newValue, this.oldValue)
  }
}

export class Dep {
  constructor () {
    this.callbacks = []
  }

  addWatcher (watcher) {
    this.callbacks.push(watcher)
  }

  notify () {
    this.callbacks.forEach(item => item.update())
  }
}
