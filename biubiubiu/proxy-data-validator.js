const user = {
    name: "jiangtao",
    age: 14
}

const userValidator = {
    name(val) {
        return typeof val === 'string'
    },
    age(val) {
        return typeof val === 'number' && val > 18
    }
}

function createValidator(target, validator) {
    return new Proxy(target, {
        _validator: validator,
        set(target, propKey, value, proxy) {
            const result = this._validator[propKey](value)
            if (result) {
                return Reflect.set(target, propKey, value, proxy)
            } else {
                throw new Error(`cannot set ${propKey} to ${value} Invalid Error`)
            }
        }
    })
}


const proxyUser = createValidator(user, userValidator)


// proxyUser.name = 123

proxyUser.name = '123'

// proxyUser.age = '10岁'

proxyUser.age = 20