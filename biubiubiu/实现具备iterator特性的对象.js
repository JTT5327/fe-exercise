const obj = {
    count: 0,
    [Symbol.iterator]: () => {
        return {
            next: () => {
                obj.count++
                if (obj.count < 10) {
                    return {
                        value: obj.count,
                        done: false
                    }
                } else {
                    return {
                        value: undefined,
                        done: true
                    }
                }
            }
        }
    }
}

/**
 * 实现一个能让下面for...of 循环遍历的对象
 *  */
for (let item of obj) {
    console.log(item)
}