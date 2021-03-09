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

export class Compiler {
  constructor (el, vm) {
    this.$vm = vm
    const fragment = this.compileFragment(el)
    this.compile(fragment)
    el.appendChild(fragment)
  }

  // 把节点放到文档片段中
  compileFragment (el) {
    const fragment = document.createDocumentFragment()
    let firstChild
    while ((firstChild = el.firstChild)) {
      fragment.appendChild(firstChild)
    }
    return fragment
  }

  //  在编译成dom树之前去编译内存中的文档片段
  compile (fragment) {
    Array.from(fragment.childNodes).forEach(node => {
      if (node.childNodes && node.childNodes.length) {
        // 如果有子节点,递归继续解析
        this.compile(node)
      }
      if (utils.isElementNode(node)) {
        // 标签节点
        this.compileElement(node)
      } else if (utils.isTextNode(node)) {
        // 文字节点
        const text = node.textContent
        const reg = /\{\{(.*)\}\}/
        const regResult = text.match(reg) // 提取出{{}}中的内容
        if (regResult && regResult[1]) {
          this.compileText(node, regResult[1].trim())
        }
      }
    })
  }

  compileElement (node) {
    Array.from(node.attributes).forEach(attr => {
      const { name, value } = attr
      if (utils.isDirect(name)) {
        const [, directive] = name.split('-')
        const [compileKey, eventName] = directive.split(':')
        utils[compileKey](node, value, this.$vm, eventName)
      }
      if (utils.isEvent(name)) {
        // @方法 @:click
        const [, eventName] = name.split('@') // on click
        utils.on(node, value, this.$vm, eventName)
      }
    })
  }

  compileText (node, exp) {
    utils.text(node, exp, this.$vm)
  }
}
