/**
 * 利用时间戳实现节流函数，第一次执行是立即执行
 * @param fn 
 * @param interval 
 */
function throttle(fn: (...args) => any, interval: number) {
    let last = 0

    return function () {
        const now = +new Date

        if (now - last > interval) {
            last = now
            fn.apply(this, arguments)
        }
    }
}
/**
 * 基于上一个节流函数利用时间戳优化，保证第一次执行必须等待interval时间之后调用才会执行
 * @param fn 
 * @param interval 
 */
function throttle1(fn: (...args) => any, interval: number) {
    let last = +new Date

    return function () {
        const now = +new Date

        if (now - last > interval) {
            last = now
            fn.apply(this, arguments)
        }
    }
}

/**
 * 基于上一个节流函数优化利用setTimeout实现：保证第一次执行也延迟执行(but 最后一次触发也要等待interval时间后再触发)
 * @param fn 
 * @param interval 
 */
function throttle2(fn: (...args) => any, interval: number) {
    let timer = null

    return function () {
        if (timer === null) {
            timer = setTimeout(() => {
                fn.apply(this, arguments)
                timer = null
            }, interval)
        }
    }
}
/**
 * 再次基于上一个节流函数优化：既保证第一次延迟执行又保证最后一次立即执行
 * @param fn 
 * @param interval 
 */
function throttle3(fn: (...args) => any, interval: number) {
    let timer = null
    let last = +new Date

    return function () {
        let now = +new Date
        let remaining = interval - (now - last) // 计算在interval时间段内，距离上一次执行还剩余多少时间

        clearTimeout(timer)

        if (remaining <= 0) {
            fn.apply(this, arguments)
            last = now
        } else {
            timer = setTimeout(() => {
                fn.apply(this, arguments)
            }, remaining)
        }
    }
}

/**
 * 防抖函数
 * @param fn 
 * @param interval 
 */
function debounce(fn: (...args) => any, interval: number) {
    let timer = null

    return function (this: any, ...args: any[]) {
        if (timer !== null) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => fn.apply(this, args), interval)
    }
}