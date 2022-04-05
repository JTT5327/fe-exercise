/**
 * 正则匹配的字符串中包含正则特殊字符转义处理
 * @param {*} string
 * @returns string
 */
 const escapeStringRegexp = (string) => {
    if (typeof string !== 'string') {
      throw new TypeError('Expected a string')
    }
    // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
    return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
  }

  /**
 * 匹配关键词高亮显示
 * @param {*} source 被匹配的源字符串
 * @param {*} keyword 匹配关键词
 * @returns 高亮匹配后的字符串文本(含html标签)
 */
const matchingKeyword = (source, keyword) => {
    const patternStr = escapeStringRegexp(keyword)
  
    const reg = new RegExp(patternStr, 'g')
  
    const matchTitle = source.replace(reg, (value) => `<span class='blue-txt'>${value}</span>`)
  
    return matchTitle
}

const matchResult = matchingKeyword('https://415.com', '415.com')

console.log(matchResult)
