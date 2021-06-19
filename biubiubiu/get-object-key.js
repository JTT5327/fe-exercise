function get(object, path) {
    if (typeof path !== 'string') {
        throw new Error(`path: ${path} not a string type`)
    }

    const _object = JSON.parse(JSON.stringify(object))

    const levelKeys = path.split('.')

    return levelKeys.reduce((acc, key) => {
        if (acc && acc[key]) {
            acc = acc[key]
        } else {
            acc = undefined
        }
        return acc
    }, _object)
}

const object = {
    a: {
        b: {
            c: '啊哈'
        }
    }
}
console.log(get(object, 'a'))
console.log(get(object, 'a.b'))
console.log(get(object, 'a.b.c'))
console.log(get(object, 'a.d'))
