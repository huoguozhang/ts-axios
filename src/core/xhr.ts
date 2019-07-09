import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress
    } = config
    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    if (onDownloadProgress) {
      request.onprogress = onDownloadProgress
    }
    if (onUploadProgress) {
      request.upload.onprogress = onUploadProgress
    }
    request.open(method.toLocaleUpperCase(), url!, false)
    if (withCredentials) {
      request.withCredentials = true
    }
    if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
      const xsrfValue = cookie.read(xsrfCookieName)
      if (xsrfValue) {
        headers[xsrfHeaderName!] = xsrfValue
      }
    }
    if (timeout) {
      request.timeout = timeout
    }
    request.ontimeout = function handleTime() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'haha', request))
    }
    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
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
        reject(
          createError(
            `request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
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
    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }
  })
}
