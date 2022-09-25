/**
 * 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。

机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

问总共有多少条不同的路径？

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/unique-paths
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function(m, n) {
    const dp = new Array(m).fill(0).map(()=> new Array(n).fill(0));
    
    for(var i = 0; i < m; i++){
        for(var j = 0; j < n; j++){
            if(i == 0 || j == 0){
                dp[i][j] = 1
            } else {
                 dp[i][j] = dp[i-1][j] + dp[i][j-1]
            }  
        }
    }

    return dp[m-1][n-1];
};

console.log(uniquePaths(3,7));