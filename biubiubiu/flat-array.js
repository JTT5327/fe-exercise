/**
 * reduce + concat+ 递归
 * @param {*} array 
 * @returns 
 */
function flat1(array) {
    return array.reduce((total, currentItem) => {
        let flatten = ''
        if (Array.isArray(currentItem)) {
            flatten = flat1(currentItem)
        } else {
            flatten = [currentItem]
        }

        return total.concat(flatten)
    }, [])
}
/**
 * 实现一个指定deep深度扁平层级的实现
 * reduce+递归
 * @param {*} array 
 */
function flatDeep(array, deep = 1) {
    if (deep > 0) {
       return array.reduce((total, currentValue) => {
            if (Array.isArray(currentValue)) {
                total = total.concat(flatDeep(currentValue, deep - 1))
            } else {
                total = total.concat(currentValue)
            }
            return total
        }, [])
    } else {
       return array.slice()
    }
}

/**
 * forEach + 闭包函数 + 递归（从外层到内层）
 * @param {*} array 
 * @returns 
 */
function flat2(array) {
    let flatten = []

    const flat = function (array) {
        array.forEach(item => {
            if (Array.isArray(item)) {
                flat(item)
            } else {
                flatten.push(item)
            }
        })
    }

    flat(array)

    return flatten
}

/**
 * 堆栈（栈尾出-栈顶进）+ 循环遍历
 * @param {*} array 
 * @returns 
 */
function flat3(array) {
    let stack = [...array]
    const result = []

    while (stack.length) {
        const item = stack.pop()
        Array.isArray(item) ? stack.push(...item) : result.unshift(item)
    }

    return result
}

/**
 * 最简单粗暴 （看有人在网上这么写的。。。）弊端是只能处理简单的字符串类型数组，对象引用型数组就无法支持
 * @param {*} array 
 * @returns 
 */
function flat4(array) {
    return array.join(',').split(',')
}

const arr = [1, 2, '', [23, 3], [4, 5], [6, [7, 8]]]

console.log(flatDeep(arr))
console.log(flat1(arr))

console.log(flat2(arr))

console.log(flat3(arr))

console.log(flat4(arr))