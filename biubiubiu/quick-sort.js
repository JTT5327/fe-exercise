function sort(nums){
    if(nums.length <=1){
        return nums
    }
    // 快排
    let leftArry = []
    let rightArray = []
    let mid = Math.floor(nums.length/2)
    let centerNum = nums.splice(mid, 1)

    for(let i =0;i<nums.length;i++){
        if(nums[i]<=centerNum){
            leftArry.push(nums[i])
        }else{
            rightArray.push(nums[i])
        }
    }

    return sort(leftArry).concat(centerNum, sort(rightArray))
}
console.log(sort([3,2,1,5,6,4]))