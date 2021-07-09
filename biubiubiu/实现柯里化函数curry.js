function curry(fn) {
    const length = fn.length

    return function curried(...args) {
        if (args.length < length) {
            return function (...args1) {
                return curried(...args.concat(args1))
            }
        } else {
            return fn.apply(this, args)
        }
    }
}

const sum = (a, b, c) => a + b + c

const curriedSum = curry(sum)

console.log(curriedSum(1)(2)(3))
console.log(curriedSum(1, 2, 3))
console.log(curriedSum(1)(2, 3))