/**
 *  bind函数实现要点
 *   1、锁定this指向；
 *   2、实现函数柯里化；
 *   3、bind函数new实例化后this指向实例；
 *   4、bing函数new实例化后的实例仍然继承原函数的原型；
 * @param {*} thisArgs 
 * @returns 
 */
Function.prototype.mbind = function (thisArgs) {
    const fn = this
    const args = Array.prototype.slice.call(arguments, 1)
    const bound = function () {
        const context = new.target ? this : thisArgs
        return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)))
    }

    bound.prototype = fn.prototype

    return bound
}

const test = {
    z: 1
}

function fn(x, y) {
    this.name = '听风是风';
    console.log(this.z);
    console.log(x);
    console.log(y);
};


const bound = fn.mbind(test)

console.log(bound(1, 2)) // 1,1,2

const person = new bound(1, 2) // undefined,1,2

console.log(person) // { name: '听风是风'}