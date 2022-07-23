// 有效的括号问题
// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效
function isValid(string) {
    const map = {
        '(': ')',
        '{': '}',
        '[': ']'
    }

    const stack = []

    for (var i = 0; i < string.length; i++) {
        const char = string[i]
        // 左括号
        if (map[char]) {
            stack.push(char) // 入栈
        } else {
            // 右括号匹配校验
            // 栈内元素为空，返回false
            if (!stack.length) {
                return false
            }
            // 出栈栈顶的左括号
            // 若当前字符不是匹配的右括号，返回false
            const leftChar = stack.pop()

            if (map[leftChar] !== char) {
                return false
            }
        }
    }
    // 若栈内元素还有剩余的左括号，返回false
    return !stack.length
}


console.log(isValid('{{{}[]}}'))
console.log(isValid('}}}}'))
console.log(isValid('{[)]}'))
console.log(isValid('{{{{{[](('))
