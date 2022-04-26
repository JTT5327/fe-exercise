/**
 * 无重复字符的最长子串长度
 * 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度
 */
// 滑动窗口
// 左指针i向右滑动一格，右指针r依次递增右移动，直到右指针位置元素k与左指针到右指针（i~r-1）之间的元素重复，记录下当前i~r-1之间最长无重复子串长度
// 重复上述步骤，直到i=r结束遍历，找出所有最长子串中最长的长度
const lengthOfLongestSubtring = function (s) {
    let rk = -1;
    let maxLength = 0;
    const subStringSet = new Set()
    for (let i = 0; i < s.length; i++) {
        if (i != 0) {
            subStringSet.delete(i - 1)
        }

        while (rk + 1 < s.length && !subStringSet.has(s.chartAt(rk + 1))) {
            subStringSet.add(s.chartAt(rk + 1))

            ++rk
        }

        maxLength = Math.max(maxLength, rk - i + 1)
    }
}
