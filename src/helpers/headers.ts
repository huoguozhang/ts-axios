import { deepMerge, isPlainObject } from './util'
import { Method } from '../types'
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}
const contentType = 'Content-Type'
export function processHeaders(headers: any, data: any) {
  normalizeHeaderName(headers, contentType)
  if (isPlainObject(data)) {
    if (headers && !headers[contentType]) {
      headers[contentType] = 'application/json;charset=utf-8'
    }
  }
  return headers
}
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  headers.split('\r\n').forEach(line => {
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    parsed[key] = vals.join(':').trim()
  })
  return parsed
}
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)
  const mehodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  mehodsToDelete.forEach(method => {
    delete headers[method]
  })
  return headers
}
