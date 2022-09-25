/**
 * 
 * 给定一个 完美二叉树 ，其所有叶子节点都在同一层，每个父节点都有两个子节点。二叉树定义如下：

struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}
填充它的每个 next 指针，让这个指针指向其下一个右侧节点。如果找不到下一个右侧节点，则将 next 指针设置为 NULL。

初始状态下，所有 next 指针都被设置为 NULL

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/populating-next-right-pointers-in-each-node
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
var connect = function (root) {
    const queue = [];

    if (root !== null) {
        queue.push(root);
    };

    while (queue.length) {
        let size = queue.length;

        let preNode = queue[0];
        let curNode = queue[0];
        for (let i = 0; i < size; i++) {
            if (i == 0) {
                preNode = queue.shift();
            } else {
                curNode = queue.shift();
                preNode.next = curNode;
                preNode = curNode;
            }
            preNode.left && queue.push(preNode.left);
            preNode.right && queue.push(preNode.right);
        }
    }

    return root;
}

function TreeNode(val, left, right, next) {
    this.val = val === undefined ? null : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
    this.next = next === undefined ? null : next;
}

// 按照层序遍历依次填满二叉树节点
function traversal(root, level) {
    const queue = [];
    if (!root) return;
    queue.push(root);
    let value = 1;
    let depthCount = 1; //层级计数器
    while (depthCount <= level) {
        const size = queue.length;
        for (let i = 0; i < size; i++) {
            const curNode = queue.shift();
            curNode.val = value;

            if (depthCount < level) {
                curNode.left = new TreeNode();
                curNode.right = new TreeNode();
                queue.push(curNode.left);
                queue.push(curNode.right);
            }

            value++;
        }
        depthCount++
    }
}

const root = new TreeNode();
traversal(root, 3);
console.log(root);

console.log(connect(root));

