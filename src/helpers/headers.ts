import { isPlainObject } from './util'
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (
      name !== normalizedName &&
      name.toLocaleUpperCase() === normalizedName.toLocaleUpperCase()
    ) {
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
