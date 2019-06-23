import {isDate, isObject} from './util'
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = []
  Object.keys(params).forEach(key => {
    const val = params[key]
    if(val === null || typeof val === 'undefined') {
      return
    }
    let values = []
    // 可能是数组可能不是数组，全部变成数组
    if (Array.isArray(val)) {
      // params: {
      //       foo: ['bar', 'hello']
      //     }
      // url: 变成了 foo[]=bar&foo[]=hello
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if(isObject(val)){
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })
  let serializedParams = parts.join('&')
  if (serializedParams) {
    // 去掉hash
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 判断url里面是否有参数
    url += (url.indexOf('?') === -1 ? '?':'&') + serializedParams
  }
  return url
}
