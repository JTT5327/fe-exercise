/**
 * 根据 逆波兰表示法，求表达式的值。

有效的算符包括 +、-、*、/ 。每个运算对象可以是整数，也可以是另一个逆波兰表达式。

注意 两个整数之间的除法只保留整数部分。

可以保证给定的逆波兰表达式总是有效的。换句话说，表达式总会得出有效数值且不存在除数为 0 的情况。
 * 
 */
var evalRPN = function(tokens) {
    const stack = []
    const operators = ['+','-','*','/'];

    for(let i = 0; i < tokens.length; i++){
        if(operators.indexOf(tokens[i]) == -1){
            stack.push(tokens[i])
        }else{
            const right = stack.pop();
            const left = stack.pop();
            let result = (eval(left + tokens[i] + right));
            //两个整数之间的除法只保留整数部分
            result = result.toString().split('.')[0];
            stack.push(result);
        }
    }

    return stack.pop();
};

console.log(evalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]));