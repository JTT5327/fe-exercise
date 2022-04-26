/**
 * 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头
 */

// 单链表构造函数
class ListNode {
    val: any
    next: ListNode | null
    constructor(val, next?: any) {
        this.val = val === undefined ? 0 : val
        this.next = next === undefined ? null : next
    }

}

/**
 * 两数相加 
 */ 
const addTwoNumbers = function (l1: ListNode | null, l2: ListNode | null) {
    let carray = 0; // 进位值
    const rootNode = new ListNode(-1)
    let currentNode = rootNode 

    while (l1 || l2) {
        const sum = (l1 ? l1.val : 0) + (l2 ? l2.val: 0) + carray
        // 两数之和对10求余
        const newVal = sum % 10
        // 缓存两数相加之后的进位值
        carray = Math.floor(sum / 10)

        currentNode.next = new ListNode(newVal)

        currentNode = currentNode.next

        l1 = l1.next
        l2 = l2.next
    }
    // 两数最后一位都相加完成之后，进位值大于0，则继续添加节点
    if(carray > 0){
        currentNode.next = new ListNode(carray)
    }

    return rootNode.next
}