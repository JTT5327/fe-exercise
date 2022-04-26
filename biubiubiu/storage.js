function set(key, value) {
    const _value = value instanceof Object ? JSON.stringify(value) : value
    this.setItem(key, _value)
  }
  
  // 默认从本地存储获取json对象
  // type = 'string', 直接从本地存储读取字符串返回
  function get(key, type) {
    const value = this.getItem(key)
  
    if (type === 'string') {
      return value
    }
  
    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  }
  
  function remove(key) {
    this.removeItem(key)
  }
  
  function clear() {
    this.clear()
  }
  
  const localStorage = {
    set: set.bind(window.localStorage),
    get: get.bind(window.localStorage),
    remove: remove.bind(window.localStorage),
    clear: clear.bind(window.localStorage)
  }
  
  const sessionStorage = {
    set: set.bind(window.sessionStorage),
    get: get.bind(window.sessionStorage),
    remove: remove.bind(window.sessionStorage),
    clear: clear.bind(window.sessionStorage)
  }
  
  export default { localStorage, sessionStorage }