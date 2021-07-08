// 定义三种状态
const PROMISE_STATUS = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

class MPromise {
    // 标记promise终值
    value = null
    // 表示promise被拒绝的reason
    reason = ''
    // 收集通过链式调用then方法传入的对应不同状态的回调函数
    fulFilledCallbackList = []
    rejectedCallbackList = []
    // promise状态
    _status = PROMISE_STATUS.PENDING
    constructor(fn) {
        this.status = PROMISE_STATUS.PENDING

        try {
            fn.call(this, this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            this.reject(error)
        }

    }
    // 改变promise状态pending=>fulfilled,且状态只能改变一次
    resolve(value) {
        if (this.status === PROMISE_STATUS.PENDING) {
            this.value = value

            this.status = PROMISE_STATUS.FULFILLED
        }
    }
    // 改变promise状态pending=> rejected，且状态只能改变一次
    reject(reason) {
        if (this.status === PROMISE_STATUS.PENDING) {
            this.reason = reason

            this.status = PROMISE_STATUS.REJECTED
        }
    }

    get status() {
        return this._status
    }

    set status(newVal) {
        this._status = newVal

        if (newVal === PROMISE_STATUS.FULFILLED) {
            this.fulFilledCallbackList.forEach(fn => {
                fn.call(this, this.value)
            })
        }

        if (newVal === PROMISE_STATUS.REJECTED) {
            this.rejectedCallbackList.forEach(fn => {
                fn.call(this, this.reason)
            })
        }
    }
    /**
     * then 要返回一个新的promise实例: const promise2 = promise1.then(onFulfilled,onRejected)
     * 1 onFulfilled 或 onRejected 执行的结果为x, 调用 resolvePromise( 这里大家可能难以理解, 可以先保留疑问, 下面详细讲一下resolvePromise是什么东西 )
     * 2 如果 onFulfilled 或者 onRejected 执行时抛出异常e, promise2需要被reject
     * 3 如果 onFulfilled 不是一个函数且promise1成功执行, promise2 以promise1的value 触发fulfilled
     * 4 如果 onRejected 不是一个函数且promise2失败执行, promise2 以promise1的reason 触发rejected
     * 5 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行resolvePromise方法
     * @param {*} onFulFilled 
     * @param {*} onRejected 
     * @returns 
     */
    then(onFulFilled, onRejected) {
        const fulFilledFn = onFulFilled
        const rejectedFn = onRejected

        function onFulFilledFnWithCatch(resolve, reject, newPromise) {
            queueMicrotask(() => {
                try {
                    if (typeof onFulFilled !== 'function') {
                        resolve(this.value)
                    } else {
                        const x = fulFilledFn(this.value)

                        this.resolvePromise(newPromise, x, resolve, reject)
                    }
                } catch (error) {
                    reject(error)
                }
            })
        }

        function onRejectedFnWithCatch(resolve, reject, newPromise) {
            // 模拟promise微任务时机执行then函数
            queueMicrotask(() => {
                try {
                    if (typeof onRejected !== 'function') {
                        reject(this.reason)
                    } else {
                        // 需要注意的是，如果promise1的onRejected执行成功了，promise2应该被resolve
                        const x = rejectedFn(this.reason)

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
        let promise
        if (this.status === PROMISE_STATUS.FULFILLED) {
            promise = new MPromise((resolve, reject) => onFulFilledFnWithCatch.call(this, resolve, reject, promise))
        } else if (this.status === PROMISE_STATUS.REJECTED) {
            promise = new MPromise((resolve, reject) => onRejectedFnWithCatch.call(this, resolve, reject, promise))
        } else if (this.status === PROMISE_STATUS.PENDING) {
            promise = new MPromise((resolve, reject) => {
                this.fulFilledCallbackList.push(() => onFulFilledFnWithCatch.call(this, resolve, reject, promise))
                this.rejectedCallbackList.push(() => onRejectedFnWithCatch.call(this, resolve, reject, promise))
            })
        }
        return promise
    }

    resolvePromise(newPromise, x, resolve, reject) {
        // 防止出现死循环
        if (x === newPromise) {
            return reject(new TypeError('x is xxxxx'))
        }

        if (x instanceof newPromise) {
            x.then(y => this.resolvePromise(newPromise, y, resolve, reject), reject)
        } else if (typeof x === 'object' || typeof x === 'function') {
            if (x === null) {
                return resolve(x)
            }

            let then = null
            try {
                then = x.then
            } catch (error) {
                return reject(error)
            }

            if (typeof then === 'function') {
                // 保证then函数里面onFulfilled，onRejected 回调函数只执行一次
                let called = false
                try {
                    then.call(x, y => {
                        if (!called) {
                            this.resolvePromise(newPromise, y, resolve, reject)
                            called = true
                        }
                    }, r => {
                        if (!called) {
                            reject(r)
                            called = true
                        }
                    })
                } catch (error) {
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

    catch(onRejected) {
        return this.then(null, onRejected)
    }

    finally(fn) {
        const pp = this.constructor

        return this.then(value => {
            return pp.resolve(fn()).then(() => value)
        }, reason => {
            return pp.resolve(fn()).then(() => {
                throw reason
            })
        })
    }

    static resolve(value) {
        if (value instanceof MPromise) {
            return value
        }
        return new MPromise(resolve => resolve(value))
    }

    static all(list) {
        if (!Array.isArray(list)) {
            throw new TypeError('params must be a array')
        }

        const result = []
        const count = 0

        return new MPromise((resolve, reject) => {
            for (let i = 0; i < list.length; i++) {
                const promise = MPromise.resolve(list[i])
                promise.then(value => {
                    result[i] = value
                    count++

                    if (count === list.length) {
                        resolve(result)
                    }
                }).catch(reason => reject(reason))
            }
        })
    }

    static allSetted(list) {
        if (!Array.isArray(list)) {
            throw new TypeError("params must be a array")
        }

        const result = []
        const count = 0
        return new MPromise((resolve, reject) => {
            for (let i = 0; i < list.length; i++) {
                MPromise.resolve(list[i]).then(value => {
                    result[i] = {
                        value,
                        status: 'fulfilled'
                    }
                }).catch(reason => {
                    result[i] = {
                        reason,
                        status: 'rejected'
                    }
                }).finally(() => {
                    count++
                    if (count === list.length) {
                        resolve(result)
                    }
                })
            }
        })
    }
}


const promise = new MPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(23333)
    }, 1000)
})

console.log(promise)

promise.then(x => {
    console.log(x)
})

setTimeout(() => {
    console.log(promise)
}, 2000)




