/**
 * 有 8 个图片资源的 url，已经存储在数组 urls 中（即urls = [‘http://example.com/1.jpg', …., ‘http://example.com/8.jpg']），
 * 而且已经有一个函数 function loadImg，输入一个 url 链接，返回一个 Promise，该 Promise 在图片下载完成的时候 resolve，下载失败则 reject。
*/

function promiseLimit(list, limit, handler) {
    const _list = [].slice.call(list)

    function asyncFn(list) {
        return handler(list.shift()).then((val) => {
            console.log('正在执行的异步任务数', val)
            if (list.length > 0) {
                return asyncFn(list)
            } else {
                return 'ok'
            }
        })
    }

    const asyncList = []

    for (let i = 0; i < limit; i++) {
        asyncList.push(asyncFn(_list))
    }

    return Promise.all(asyncList)
}

let count = 0
function loadImg() {
   
    return new Promise((resolve, reject) => {
        count++
        const script = document.createElement('script')

        script.addEventListener('load', () => {
            console.log(`当前并发数`, count--)
            resolve()
        })

        script.addEventListener('error', () => {
            reject()
        })

        script.src = url
    })
}

const urls = [
    'https://si.geilicdn.com/pcitem901523581942-063e0000017821bc50d20a20b7b9_800_800.jpg.webp?w=400&h=400',
    'https://si.geilicdn.com/pcitem901523581942-7b530000017825ff395e0a217216_800_800.jpg.webp?w=400&h=400',
    'https://si.geilicdn.com/pcitem901523581942-681c0000017825fdd7910a21c2a7_800_800.jpg.webp?w=400&h=400',
    'https://si.geilicdn.com/pcitem901523581942-031d000001782604a3aa0a217216_800_800.jpg.webp?w=400&h=400'
]

promiseLimit(urls, 3, loadImg).then(res => {
    console.log(res)
}).catch(res => {
    console.log(res)
})
