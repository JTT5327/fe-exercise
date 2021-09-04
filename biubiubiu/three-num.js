var threeSum = function (nums) {
    // 先升序排序
    nums.sort((a, b) => a - b)
    // 采用双指针遍历找出符合a+b+c的值=0
    var target = 0
    var index = 0
    var result = []
    while (index < nums.length) {
        var c = nums[index]
        // 两数求和 start下标不能和之前的重复
        var start = index + 1
        var end = nums.length - 1
        while (start < end) {
            var left = nums[start]
            var right = nums[end]
            if (nums[start] + nums[end] < target - c) {
                start++
            } else if (nums[start] + nums[end] > target - c) {
                end--
            } else {
                result.push([nums[start], nums[end], c])
                // 去除重复的下标
                while (start < end && nums[start] == left) start++
                while (start < end && nums[end] == right) end--
            }
        }
        // 第三个数依然不能重复
        do { index++ } while (index < nums.length - 1 && nums[index] === nums[index - 1])
    }
    return result
}

var result = threeSum([-1, 0, 1, 2, -1, -4])
console.log(result)
