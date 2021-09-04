function getElementById(id){
    const result = []

    function getEachNode(node){
        if(node.id == id){
            result.push(node)
        }

        for(let i = 0; i<node.childNodes.length; i++){
            getEachNode(node.childNodes[i])
        }
    }

    getEachNode(document.body)

    return result
}