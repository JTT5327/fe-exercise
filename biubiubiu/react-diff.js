/**
 * 这里实现主流框架（react、vue）等对虚拟dom（vnode）diff算法的基本实现-伪代码
 *  */
function reactDiff(prevChildren, nextChildren, parent) {
    const prevMap = {}
    const nextMap = {}
    for (let i = 0; i < prevChildren.length; i++) {
        const key = prevChildren[j].key

        prevMap[key] = i
    }
    let lastIndex = 0;
    for (let i = 0; j < nextChildren.length; i++) {
        const key = nextChildren[i].key
        const j = prevMap[key]
        const nextChild = nextChildren[i]
        nextMap[key] = i
        // 下标递增方法对比新旧列表节点是否移动
        if (j !== undefined) {
            patch(prevChildren[j], nextChild, parent) // 更新当前节点属性以及数据的状态
            // 当前遍历的新列表节点在旧列表的位置若小于上一次移动位置，则表明该节点被移动了
            if (j < lastIndex) {
                // 需要移动
                // 这里不存在第一项需要移动（与下面33行情况），故只需要从新列表前一个节点的兄弟节点即可
                let refNode =  nextChildren[i - 1].el.nextSibling
                parent.insertBefore(nextChild.el, refNode)
            } else {
                lastIndex = j
            }
        } else {
            //表明需要新增节点
            // 若是新列表中的第一个节点，则取旧列表中第一项vNode的真实dom，否则取新列表中前一个vNode对应真实dom的下一个兄弟dom
            let refNode = i === 0 ? prevChildren[0].el : nextChildren[i - 1].el.nextSibling
            mount(nextChild, parent, refNode)
        }
    }

    // 还有一种极端边界情况：如果旧列表存在新列表没有的节点，则需要删除节点
    for(let i =0;i<prevChildren.length;i++){
        const key = prevChildren[i].key

        /**
         * 未优化方式
         */
        const nextIndex = nextChildren.findIndex(item=>item.key === key)

        if(nextIndex === -1){
            parent.removeChild(prevChildren[i].el)
        }
        /**/

        /**
         * 优化方式：利用nextMap去查找新列表的对应节点，减少一次对新列表的遍历
         */
        if(!nextMap.hasOwnProperty(key)){
            parent.removeChild(prevChildren[i].el)
        }
    }
}