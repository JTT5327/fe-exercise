function lightCopy(obj) {
    // return Object.assign({}, obj)
    const newObj = {}
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key]
        }
    }

    return newObj
}

/**
 * 深拷贝
 * 需要注意两点：1、循环引用；2、相同引用；3、不同数据类型的处理（需要补充很多数据类型判断逻辑才能保证函数足够强壮，借鉴lodash库:_.cloneDeep()函数）
 * @param {*} object 
 * @param {*} map 
 */
function deepCopy(object, map = new WeakMap()) {
    // 为null不做深拷贝直接返回
    if (object === null) return object
    if (object instanceof Date) return new Date(object)
    if (object instanceof RegExp) return new RegExp(object)
    // 若不是对象类型，则直接返回（注：typeOf null === ‘object’ is true）
    if (typeof object !== 'object') return object
    /**
     * 若当前正在递归遍历的对象跟已经递归过的对象是同一对象，则直接返回该对象,
     * 为了解决循环引用的问题
     */
    if (map.get(object)) return map.get(object)
    // 主要对数组类型还是对象类型进行区分
    let copyData = Array.isArray(object) ? initCloneArray(object) : new object.constructor()
    map.set(object, copyData)

    for (let key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            copyData[key] = deepCopy(object[key], map)
        }
    }

    return copyData
}

function initCloneArray(array) {
    const { length } = array
    // 初始化创建一个相同长度的数组副本
    const copyArray = new array.constructor(length)
    /**
     * regExp.exec() 可能返回一个比较特别的数组
     *  var re = /quick\s(brown).+?(jumps)/ig;
     *  var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');
     *  console.log(result);
     * 输出的 result 是一个数组，有 3 个元素和 4 个属性
     * 0: "Quick Brown Fox Jumps"
     * 1: "Brown"
     * 2: "Jumps"
     * groups: undefined
     * index: 4
     * input: "The Quick Brown Fox Jumps Over The Lazy Dog"
     * length: 3
     */
    if (length && typeof array[0] === 'string' && Object.prototype.hasOwnProperty.call(array, 'index')) {
        copyArray.index = array.index
        copyArray.input = array.input
    }

    return copyArray
}

const ttt = {
    name: 'jtt',
    age: 18
}

//demo 循环引用自身
ttt.self = ttt
// 相同引用
ttt.group = ttt.group2 = { name: '大心脏', slogan: '做大做强' }

console.log(ttt)

const copyTtt = deepCopy(ttt)
console.log('深拷贝之后')
copyTtt.group.name = '打不死的小强'
console.log('原始对象', ttt)
console.log('复制对象', copyTtt)
