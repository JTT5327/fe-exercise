// 定义三种状态
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'
function isFunction(fn) {
    return typeof fn === 'function'
}
class JPromise {
    // 收集通过链式调用then方法传入的对应不同状态的回调函数
    onFulfilleds = []
    onRejecteds = []
    constructor(fn) {
        // promise状态
        this.status = PENDING
        // 标记promise终值
        this.value = null
        // 表示promise被拒绝的reason
        this.reason = null

        fn(this.resolve, this.reject)
    }

    // 改变promise状态pending=>fulfilled,且状态只能改变一次
    resolve(val) {
        if (this.status === PENDING) {
            this.status = FULFILLED
            this.value = val
        }

    }
    // 改变promise状态pending=> rejected，且状态只能改变一次
    reject(reason) {
        if (this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
        }
    }

    /**
     * 响应式监听status
     * @memberof JPromise
     */
    set status(val) {
        this._status = val
        switch (val) {
            case FULFILLED: {
                this.onFulfilleds.forEach(onFulfilled => onFulfilled(this.value))
                break
            }
            case REJECTED: {
                this.onRejecteds.forEach(onRejected => onRejected(this.reason))
                break
            }
        }
    }

    get status() {
        return this._status
    }

    then(onFulfilled, onRejected) {
        /**
         * then 要返回一个新的promise实例: const promise2 = promise1.then(onFulfilled,onRejected)
         * 1 onFulfilled 或 onRejected 执行的结果为x, 调用 resolvePromise( 这里大家可能难以理解, 可以先保留疑问, 下面详细讲一下resolvePromise是什么东西 )
         * 2 如果 onFulfilled 或者 onRejected 执行时抛出异常e, promise2需要被reject
         * 3 如果 onFulfilled 不是一个函数且promise1成功执行, promise2 以promise1的value 触发fulfilled
         * 4 如果 onRejected 不是一个函数且promise2失败执行, promise2 以promise1的reason 触发rejected
         * 5 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行resolvePromise方法
         */
        const onFulfilledFn = isFunction(onFulfilled) ? onFulfilled : (val) => val
        const onRejectedFn = isFunction(onRejected) ? onRejected : (reason) => reason

        function onFulfilledFnWatch(resolve, reject) {
            // 模拟promise微任务时机执行then函数
            queueMicrotask(() => {
                try {
                    if (!isFunction(onFulfilled)) {
                        resolve(this.value)
                    } else {
                        const x = onFulfilledFn(this.value)

                        this.resolvePromise(newPromise, x, resolve, reject)
                    }
                } catch (error) {
                    reject(error)
                }
            })

        }

        function onRejectedFnWatch(resolve, reject) {
            queueMicrotask(() => {
                try {
                    // 需要注意的是，如果promise1的onRejected执行成功了，promise2应该被resolve
                    if (!isFunction(onRejected)) {
                        reject(this.reason)
                    } else {
                        const x = onRejectedFn(this.reason)

                        this.resolvePromise(newPromise, x, resolve, reject)
                    }
                } catch (error) {
                    reject(error)
                }
            })
        }
        /**
         * 根据当前status状态结果执行对应不同的回调函数，
         * 若当前status任然为pending，则用数组缓存下多个链式then方法注册的回调函数，等待状态变更时机依次执行回调
         */
        switch (this.status) {
            case FULFILLED: {
                const newPromsie = new JPromise(onFulfilledFnWatch)
                return newPromsie
            }
            case REJECTED: {
                const newPromsie = new JPromise(onRejectedFnWatch)
                return newPromsie
            }
            case PENDING: {
                const newPromsie = new JPromise((resolve, reject) => {
                    this.onFulfilleds.push(() => onFulfilledFnWatch(resolve, reject))
                    this.onRejecteds.push(() => onRejectedFnWatch(resolve, reject))
                })

                return newPromsie
            }
        }
    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }

    resolvePromise(newPromise, x, resolve, reject) {
        // 防止出现死循环
        if (newPromise === x) {
            return reject(new TypeError('this promise and the return value are same'))
        }
        if (x instanceof JPromise) {
            x.then(y => this.resolvePromise(newPromise, y, resolve, reject), reject)
        } else if (typeof x === 'object' || isFunction(x)) {
            if (x === null) {
                resolve(x)
            }

            let then = null

            try {
                then = x.then
            } catch (error) {
                reject(error)
            }

            if (isFunction(then)) {
                // 保证then函数里面onFulfilled，onRejected 回调函数只执行一次
                let called = false
                try {
                    then.call(x, (y) => {
                        if (called) return
                        called = true
                        this.resolvePromise(newPromise, y, resolve, reject)
                    }, (r) => {
                        if (called) return
                        called = true
                        reject(r)
                    })
                } catch (error) {
                    if (called) return
                    called = true
                    reject(error)
                }

            } else {
                // then不是一个函数，则以x为参数执行newPromise
                resolve(x)
            }
        } else {
            // x 不是对象或者函数，则以x为参数执行newPromise
            resolve(x)
        }
    }
    /**
     * 以下是JPromise类下的静态方法实现
     */
    static resolve(val) {
        if (val instanceof JPromise) {
            return val
        }
        // 等价于
        return new JPromise((resolve, reject) => {
            resolve(val)
        })
    }

    static reject(reason) {
        return new JPromise((resolve, reject) => {
            reject(reason)
        })
    }

    static all(promiseList) {
        if (!Array.isArray(promiseList)) {
            return new Error('入参必须是数组类型')
        }
        const result = []
        const count = 0 // 成功执行promise的项+1,计数器用来保证所有promise数组执行状态均变为终态
        return new JPromise((resolve, reject) => {
            for (const i = 0; i < promiseList.length; i++) {
                JPromise.resolve(promiseList[i]).then(value => {
                    count++
                    // result.push(value)
                    result[i] = value // 通过索引i下标保证promise数组返回的顺序
                    /**
                     * 这里不能用result.length === _list.length 判断，
                     * 因为多个promise异步并发执行,若数组最后一个promise最先返回，则直接成功执行resolve
                     * 即：
                     *   result = []; 
                     *   result[6] = value; 
                     *   result.length ==== 7 //true
                     */
                    if (count === promiseList.length) {
                        resolve(result)
                    }
                }).catch(reason => reject(reason))
            }
        })
    }

    static race(list) {
        if (!Array.isArray(list)) {
            return new Error('入参必须是数组类型')
        }
        return new JPromise((resolve, reject) => {
            if (!list.length) {
                return resolve()
            }
            for (const i = 0; i < list.length; i++) {
                JPromise.resolve(list[i]).then(value => resolve(value), reason => reject(reason))
            }
        })
    }
}