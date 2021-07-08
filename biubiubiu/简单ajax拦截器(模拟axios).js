// // 代码片段
// ajax.before(function (url) {
//     console.log('before 1');
//     return url;
// })
// ajax.before(function (url) {
//     console.log('before 2');
//     return url;
// })
// ajax.after(function (url, res) {
//     console.log('after 1');
//     res.after = true;
//     return res;
// })
// ajax.get('www.baidu.com', (res) => {
//     console.log('callback res');
//     console.log(res);
// });


// // 执行ajax.get后会输出以下内容
// before 1
// before 2
// after 1
// callback res
// {
//     ...

// 	    after: true
// 	}
/**
 * 方案一（for循环遍历）
 */
// const beforeList = []
// const afterList = []

// function before(fn) {
//     beforeList.push(fn)
// }

// function after(fn) {
//     afterList.push(fn)
// }

// function get(url, callback) {
//     let _url = null
//     let _res = {}

//     for (let i = 0; i < beforeList.length; i++) {
//         _url = beforeList[i](url)
//     }

//     for (let i = 0; i < afterList.length; i++) {
//         _res = afterList[i](_url, _res)
//     }

//     callback(_res)
// }

// const ajax = { before, after, get }

/**
 * 方案二（promise链式调用）
 */
const beforeList = []
const afterList = []
const ajax = {
    before(fn) {
        beforeList.push(fn)
    },
    after(fn) {
        afterList.push(fn)
    },
    get(url, callback) {
        const _res = {}

        let promise = beforeList.reduce((promise, fn) => promise.then(fn), Promise.resolve(url))

        promise = promise.then(() => Promise.resolve(_res))

        promise = afterList.reduce((promise, fn) => {
            return promise.then(res => fn(url, res))
        }, promise)

        return promise.then((res) => callback(res))
    }
}

ajax.before(function (url) {
    console.log('before 1');
    return url;
})
ajax.before(function (url) {
    console.log('before 2');
    return url;
})
ajax.after(function (url, res) {
    console.log('after 1');
    res.after = true;
    return res;
})
ajax.get('www.baidu.com', (res) => {
    console.log('callback res');
    console.log(res);
});