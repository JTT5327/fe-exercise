import add from "./add";
import multiply from "./multiply";
import { once } from 'lodash'

const onceAdd = once(add)
const addResult = onceAdd(1, 2)

const mulResult = multiply(2, 2)

console.log(addResult)
console.log(mulResult)