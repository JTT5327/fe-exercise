// 将颜色十六进制格式转换为rgb格式
// #ffffff  => rbg(255,255,255)
function hex2rgb(hex) {
    // 校验hex颜色值是否有效
    if (typeof hex !== 'string' || !/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(hex)) {
        return new Error(hex + ' is not valid')
    }

    const str = hex.split('#')[1].toLowerCase();
    let arry = str.split('');
    const result = [];

    if (arry.length === 3) {
        arry = arry.map((char) => `${char}${char}`)
    } else if (arry.length === 6) {
        arry = [`${arry[0]}${arry[1]}`, `${arry[2]}${arry[3]}`, `${arry[4]}${arry[5]}`]
    }


    for (let i = 0; i < arry.length; i++) {
        // result[i] = transfer16To10(arry[i])
        result[i] = parseInt(arry[i], 16)
    }

    return `rgb(${result[0]},${result[1]},${result[2]})`
}

function transfer16To10(source) {
    let index = 0;
    const stack = source.split('');
    let result = 0
    const map = {
        'a': 10,
        'b': 11,
        'c': 12,
        'd': 13,
        'e': 14,
        'f': 15
    }

    while (stack.length) {
        let number = stack.pop()

        number = map[number] || number

        result += number * Math.pow(16, index)

        index++
    }

    return result
}

console.log(hex2rgb('#ffffff'))
console.log(hex2rgb('fffff'))

console.log(parseInt('01', 10))
console.log(parseInt('000', 10))
const num = 59
console.log(num.toString(16))
