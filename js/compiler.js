/*
  解析模板指令
*/
import utils from './utils.js'
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
