/**
 * 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。
 */
// 时间复杂度：O(N²) 空间复杂度： O(1)
/**
 * 找出两数之和为指定目标值的两个元素位置
 */
const twoSum = function (nums, target) {
    for (var i = 0; i < nums.length; i++) {
        for (var j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j]
            }
        }
    }
}

const nums = [1, 2, 3, 4, 5, 6, 7]
console.log(twoSum(nums, 8))


// 时间复杂度：O(N) 空间复杂度：O(N)
const towSum2 = function (nums, target) {
    const map = {}

    for (var i = 0; i < nums.length; i++) {
        if(map[target - nums[i]]){
            return [i, map[target - nums[i]]]
        }else{
            map[nums[i]] = i
        }

        console.log(map)
    }
}

console.log(towSum2(nums, 8))

