var integerBreak = function(n) {
    /**
     * 给定一个正整数 n ，将其拆分为 k 个 正整数 的和（ k >= 2 ），并使这些整数的乘积最大化。
     * 返回 你可以获得的最大乘积 。
     * https://leetcode.cn/problems/integer-break/
     */
    // 定义dp[i] 表示拆分正整数i，其最大乘积值为dp[i]
    const dp = [];
    dp[2] = 1;
    // 这里dp[0], dp[1]并无意义，故遍历i从3开始；
    for(var i = 3; i <= n; i++){
        for(var j = 1; j< i-1; j++){
            dp[i] = Math.max(dp[i] || 0, (i-j)*j, dp[i-j]*j);
            console.log(i,dp[i]);
        }
    }

    return dp[n];
};

console.log(integerBreak(10));
