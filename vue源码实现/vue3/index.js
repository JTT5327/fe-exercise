function isObject(obj) {
    return obj && typeof obj === 'object'
}
let targetMap = new WeakMap()

let activeEffect
/**
 * {
 *   target:{
 *     key: [activeEfect,activeEfect,activeEfect,...]
 *   }
 * }
 * 收集依赖
 * @param {*} target 目标对象
 * @param {*} key 目标对象下的属性
 */
function track(target, key) {
    let depsMap = targetMap.get(target)
    !depsMap && targetMap.set(target, (depsMap = new Map()))

    let dep = depsMap.get(key)
    !dep && depsMap.set(key, (dep = new Set()))

    !dep.has(activeEffect) && dep.add(activeEffect)
}
/**
 * 通知
 */
function trigger(target, key) {
    let depsMap = targetMap.get(target)

    if (!depsMap) return

    depsMap.get(key).forEach(effect => effect && effect())
}

function effect(fn, options = {}) {
    const __effect = function (...args) {
        activeEffect = __effect
        return fn(...args)
    }

    if (!options.lazy) {
        __effect()
    }

    return __effect
}

/**
 * const a = reactive({ count : 0 })
 * a.count++
 */
export function reactive(data) {
    if (!isObject(data)) return

    return new Proxy(data, {
        get(target, key, receiver) {
            // 反射target[key]  --> 继承关系有坑
            const ret = Reflect.get(target, key, receiver)

            // 依赖收集
            track(target, key)

            return isObject(ret) ? reactive(ret) : ret
        },
        set(target, key, newVal, receiver) {
            Reflect.set(target, key, newVal, receiver)
            //通知
            trigger(target, key)
            return true
        },
        deleteProperty(target, key, receiver) {
            const ret = Reflect.deleteProperty(target, key, receiver)
            //通知
            trigger(target, key)
            return ret
        }
    })
}

/**
 * 基本类型(由于不能被proxy对象直接监听拦截，通过一个对象封装进行拦截监听)
 * const count = ref(0)
 * conut.value++
 */
export function ref(target) {
    let value = target
    const obj = {
        get value() {
            track(obj, 'value')
            return value
        },
        set value(newValue) {
            if (value === newValue) return
            value = newValue
            trigger(obj, 'value')
        }
    }

    return obj
}

/**
 * 延迟计算
 */
export function computed(fn) {//只考虑函数的情况
    //延迟计算 const c = computed(()=> `${count.value}+ !!!`) c.value
    let __computed
    const run = effect(fn, { lazy : true })

    __computed = {
        get value() {
            return run()
        }
    }

    return __computed
}

export function mount(instance, el) {
    effect(function () {
        instance.$data && update(instance, el)
    })

    instance.$data = instance.setup()

    update(instance, el)

    function update(instance, el) {
        el.innerHTML = instance.render()
    }
}