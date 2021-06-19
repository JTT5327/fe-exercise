var merge = function(nums1, m, nums2, n) {
    let sortArr = new Array(m+n)
    
    // p1表示nums1数组指针，p2表示nums2数组指针
    let p1 = p2 = 0
    for(let i = 0; i<m+n; i++){
        if(p1 === m){
            sortArr[i] = nums2[p2++]
        }else if(p2 === n){
            sortArr[i] = nums1[p1++]
        }else if(nums1[p1] < nums2[p2]){
           sortArr[i] = nums1[p1++]
        }else{
            sortArr[i] = nums2[p2++]
        }
    }

    // nums1 = sortArr

    return sortArr
};

console.log(merge([1,2,3,0,0,0],3,[2,5,6],3))