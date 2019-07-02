const toString = Object.prototype.toString
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}
/*export function isObject(val: any): val is Object {
  return typeof (val) === 'object' && val !== null
}*/
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
export function deepMerge(...objs: any[]): any {
  // 考虑headers
  // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
  // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  // val1 { auth-token: 'xxx', post: {app: xxx, bcc: xxx}, get: {bcc: xxx}    } val2 {h3c-app: 'xxx'}
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        // key post val {app: xxx, bcc: xxx}
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge({}, val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}
