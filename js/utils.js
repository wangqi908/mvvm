import { Watcher } from './watcher.js'

const utils = {
  // 判断标签节点
  isElementNode (node) {
    return node.nodeType === 1
  },

  // 判断文字节点
  isTextNode (node) {
    return node.nodeType === 3
  },

  isDirect (name) {
    return name.startsWith('v-')
  },

  // 判断是不是@开头事件
  isEvent (name) {
    return name.startsWith('@')
  },

  text (node, exp, vm) {
    // node exp:"name" vm
    this.bind(node, exp, vm, 'text')
  },

  html (node, exp, vm) {
    this.bind(node, exp, vm, 'html')
  },

  class (node, exp, vm) {
    this.bind(node, exp, vm, 'class')
  },

  model (node, exp, vm) {
    this.bind(node, exp, vm, 'model')
    node.addEventListener('input', (event) => {
      const value = event.target.value
      this.setValue(exp, vm, value)
    })
  },

  on (node, exp, vm, eventName) {
    const fn = vm.$options.methods[exp]
    node.addEventListener(eventName, fn.bind(vm), false)
  },

  bind (node, exp, vm, compileKey) {
    const updaterFn = updater[compileKey + 'Updater']
    const value = this.getValue(exp, vm)
    updaterFn && updaterFn(node, value)
    /*
      实例化观察者
      初始化编译和更新的时候,bind()方法会调用data对象set和get
      watcher实例化时会调用getOldValue(),于是会调用data对象get,此时便可以给Dep添加watcher
    */
    new Watcher(exp, vm, (newVal, oldVal) => {
      updaterFn && updaterFn(node, newVal, oldVal)
    })
  },

  // 取值
  getValue (exp, vm) {
    let val = vm.$data
    exp = exp.split('.')
    exp.forEach(k => {
      val = val[k]
    })
    return val
  },

  // 赋值
  setValue (exp, vm, newValue) {
    let val = vm
    exp = exp.split('.')
    exp.forEach((k, i) => {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) val = val[k]
      else val[k] = newValue
    })
  }
}

const updater = {
  textUpdater (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  },
  htmlUpdater (node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value
  },
  modelUpdater (node, value) {
    node.value = typeof value === 'undefined' ? '' : value
  },
  // 更新 class
  classUpdater (node, newVal, oldVal) {
    let className = node.className
    className = className.replace(oldVal, '').trim()
    node.className = className + (className ? ' ' : '') + newVal
  }
}

export default utils
