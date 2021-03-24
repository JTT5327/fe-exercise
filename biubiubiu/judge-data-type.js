function getType(obj) {
    return function (type) {
        console.log(Object.prototype.toString.call(obj))
        return Object.prototype.toString.call(obj) === `[object ${type}]`
    }
}

function isObject(obj) {
    return getType(obj)('Object')
}


console.log('[] is object or not:', isObject([]))