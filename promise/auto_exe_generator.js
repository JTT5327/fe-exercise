/**
 * 迭代器Iterator 是 ES6 引入的一种新的遍历机制，同时也是一种特殊对象，它具有一些专门为迭代过程设计的专有接口。
 * 每个迭代器对象都有一个next()方法，每次调用都返回一个当前结果对象。当前结果对象中有两个属性：
 * 1. value：当前属性的值
 * 2. done：用于判断是否遍历结束，当没有更多可返回的数据时，返回true
 * 每调用一次next()方法，都会返回下一个可用的值，直到遍历结束。
 * generator函数就是一个生成迭代器对象的函数
 * generator函数声明语法用function* (){} 声明
 * generator函数内部会用到yield 关键字，每次执行一条yield语句函数就会自动停止，需要通过迭代器.next()方法才能继续执行下一条语句
 * 
 * 下面封装一个函数，实现自动遍历迭代generator函数
 */

function asyncFunction(generator) {
    const iterator = generator()

    const next = (data) => {
        const { value, done } = iterator.next(data)

        if (done) return

        value.then((data) => next(data))
    }

    next()
}

function loadTime(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(time), time)
    })
}

asyncFunction(function* () {
    let data = yield loadTime(1000)

    console.log(data)

    data = yield loadTime(2000)

    console.log(data)
})