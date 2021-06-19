function __isNaN(a, b) {
    return Number.isNaN(a) && Number.isNaN(b)
}

export class Vue {
    constructor(options = {}) {
        this.$options = options
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
        this.$methods = options.methods
        this.$data = options.data

        // 为了缩短访问vue实例属性的长度 this.$data.xxx --> this.xxx
        this.proxy(this.$data)

        // observer 数据监听
        new Observer(this.$data)

        // 编译模板
        new Compiler(this)
    }
    // 代理数据 this.$data.xxx -> this.xxx
    proxy(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    //   NaN !== NaN  -> true
                    if (data[key] === newValue || (__isNaN(newValue, data[key]))) {
                        return
                    }
                    data[key] = newValue
                }
            })
        })
    }
}

class Dep {
    constructor() {
        this.deps = new Set()
    }
    /** 
     * 收集依赖（订阅） 
     */
    add(dep) {
        if (dep && dep.update) this.deps.add(dep)
    }
    /**
     * 更新依赖（发布）
     */
    notify() {
        this.deps.forEach(dep => dep.update())
    }
}

class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb

        Dep.target = this

        this._old = vm[key] //缓存初始值

        Dep.target = null
    }
    update() {
        const newValue = this.vm[this.key]

        if (this._old === newValue || __isNaN(this._old, newValue)) return

        this.cb(newValue)
    }
}

class Observer {
    constructor(data) {
        this.walk(data)
    }

    walk(data) {
        if (!data || typeof data !== 'object') return
        Object.keys(data).forEach(key => this.defineReactive(data, key, data[key]))
    }

    defineReactive(obj, key, value) {
        let that = this
        this.walk(value)  // 递归调用处理嵌套对象 { a: { b: 0 } }
        const dep = new Dep()

        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get() {
                // Dep.target 挂载watcher实例
                Dep.target && dep.add(Dep.target)
                return value
            },
            set(newVal) {
                // NaN
                if (value === newVal || __isNaN(newVal, value)) return
                value = newVal
                that.walk(newVal)
                // 通知该属性对应所有注册的依赖属性
                dep.notify()
            }
        })
    }
}

class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.methods = vm.$methods

        this.compile(vm.$el)
    }

    compile(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compileTextNode(node)
            } else if (this.isElementNode(node)) {
                // 正则匹配元素节点的属性
                this.compileElementNode(node)
            }

            // 递归嵌套子节点编译
            if (node.childNodes && node.childNodes.length){
                this.compile(node)
            } 
        })
    }
    isTextNode(node) {
        return node.nodeType === 3
    }
    isElementNode(node) {
        return node.nodeType === 1
    }
    isDirectiveAttr(attr) {
        return /^v-.+/.test(attr)
    }
    // this is {{count}}
    compileTextNode(node) {
        let value = node.textContent
        let reg = /\{\{(.+?)\}\}/

        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            // 将文本节点的内容替换为对应vue实例属性key的值
            node.textContent = value.replace(reg, this.vm[key])
            // 此时创建watcher实例并且收集key属性的依赖
            new Watcher(this.vm, key, newValue => {
                node.textContent = newValue
            })
        }
    }
    compileElementNode(node) {
        if (node.attributes.length) {
            Array.from(node.attributes).forEach(attr => {
                let attrName = attr.name
                if (this.isDirectiveAttr(attrName)) {
                    // v-on:click / v-model / v-text / ...
                    attrName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2)
                    let key = attr.value

                    this.update(node, key, attrName, this.vm[key])
                }
            })
        }
    }

    update(node, key, attrName, value) {
        if (attrName === 'text') {
            node.textContent = value
            new Watcher(this.vm, key, newValue => node.textContent = newValue)
        } else if (attrName === 'model') {
            // v-model =>（等价于） v-bind:key & v-on:input
            node.value = value
            new Watcher(this.vm, key, newValue => node.value = newValue)
            node.addEventListener('input', () => {
                this.vm[key] = node.value
            })
        } else if (attrName === 'click') {
            node.addEventListener(attrName, this.methods[key].bind(this.vm))
        }
        // else ...
    }
}