class EventEmitter {
    constructor() {
        this.events = {}
    }

    on(event, cb, isEmittedEvenExcute = false) {
        if (!this.events[event]) {
            this.events[event] = []
        }

        this.events[event].push(cb)
        // 保证该事件监听如果注册时机晚于事件触发时期，则立即执行该回调函数
        if(isEmittedEvenExcute && this.events[event].emitted){
             cb.apply(this, this.events[event].args)
        }

        return this
    }

    once(event, cb) {
        const func = (...args) => {
            this.off(event, func)

            cb.apply(this, args)
        }

        this.on(event, func)

        return this
    }

    off(event, cb) {
        if (!cb) {
            this.events[event] = null
        } else {
            this.events[event].filter(item => item != cb)
        }
        return this
    }

    emit(event, ...args) {
        const cbs = this.events[event] || []

        // if (!cbs.length) {
        //     throw new Error(`当前event${event}未被注册监听!`)
        // }

        cbs.length && cbs.forEach(cb => cb.apply(this, args))
        // 表明当前事件已经被触发过了
        this.events[event].emitted = true
        this.events[event].args = args

        return this
    }
}