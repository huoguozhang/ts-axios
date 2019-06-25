import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config
    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    request.open(method.toLocaleUpperCase(), url, false)
    if (timeout) {
      request.timeout = timeout
    }
    request.ontimeout = function handleTime() {
      reject(new Error(`timeout of ${timeout} ms exceeded`))
    }
    request.onerror = function handleError() {
      reject(new Error('Network Error'))
    }
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return false
      }
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }
    function handleResponse(response: AxiosResponse) {
      const status = response.status
      if (status >= 200 && status < 300) {
        resolve(response)
      } else {
        reject(new Error(`request failed with status code ${response.status}`))
      }
    }
    Object.keys(headers).forEach(name => {
      if (data === null && name.toLocaleLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
    request.send(data)
  })
}
