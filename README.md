# mvvm

## 1. 数据代理
  通过vm对象来代理data对象中所有属性的操作
  好处: 更方便的操作data中的数据

## 2. 模板解析
  解析所有层次子节点递归进行编译解析处理

## 3. 数据绑定
  一旦更新了data中的某个属性数据, 所有界面上直接使用或间接使用了此属性的节点都会更新
  通过Object.defineProperty()给data中所有属性添加setter/getter, 实现数据劫持
  为每个data中的属性创建一个对应的dep对象, 一旦属性数据变化, 通知dep对象
  为模板中的每个表达式创建对应的watcher, 并关联到对应的dep上
  一旦dep收到数据变化的通知, 会通知所有关联的watcher, watcher收到通知后就更新对应的节点

## 4. 双向数据绑定
  双向数据绑定是建立在单向数据绑定(model==>View)的基础之上的
  在解析v-model指令时, 给当前元素添加input监听
  当input的value发生改变时, 将最新的值赋值给当前表达式所对应的data属性