import axios, { AxiosResponse, AxiosError } from '../src/index'
import { getAjaxRequest } from './helper'
describe('requests', () => {
  beforeEach(() => {
    // 把 global.XMLHttpRequest = mockAjaxFunction
    jasmine.Ajax.install()
  })

  afterEach(() => {
    // global.XMLHttpRequest = realAjaxFunction
    jasmine.Ajax.uninstall()
  })
  test('should treat single string arg as url', () => {
    axios('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test('should treat method values as lowercase string', done => {
    axios({
      url: '/foo',
      method: 'POST'
    }).then(response => {
      expect(response.config.method).toBe('post')
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
    })
  })

  test('should reject on network errors', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    jasmine.Ajax.uninstall()

    axios('http://localhost:9999/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    function next(reason: AxiosResponse | AxiosError) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Network Error')
      expect(reason.request).toEqual(expect.any(XMLHttpRequest))

      jasmine.Ajax.install()

      done()
    }
  })

  test('should reject when request timeout', done => {
    let err: AxiosError

    axios('/foo', {
      timeout: 2000,
      method: 'post'
    }).catch(error => {
      err = error
    })

    getAjaxRequest().then(request => {
      // @ts-ignore
      request.eventBus.trigger('timeout')

      setTimeout(() => {
        expect(err instanceof Error).toBeTruthy()
        expect(err.message).toBe('Timeout of 2000 ms exceeded')
        done()
      }, 100)
    })
  })

  test('should reject when validateStatus returns false', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    axios('/foo', {
      validateStatus(status) {
        return status !== 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })

    function next(reason: AxiosError | AxiosResponse) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('request failed with status code 500')
      expect((reason as AxiosError).response!.status).toBe(500)

      done()
    }
  })

  test('should reject when validateStatus returns true', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    axios('/foo', {
      validateStatus(status) {
        return status === 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })

    function next(reason: AxiosError | AxiosResponse) {
      expect(resolveSpy).toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()

      done()
    }
  })

  test('should return JSON when resolved', done => {
    let response: AxiosResponse
    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => {
      response = res
      /*expect(response.data).toEqual({ a: 1 })
        done()*/
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'ok',
        responseText: `{"a": 1}`
      })

      setTimeout(() => {
        expect(response.data).toEqual({ a: 1 })
        done()
      }, 100)
    })
  })

  test('should return JSON when reject', done => {
    let response: AxiosResponse
    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).catch(e => {
      response = e.response
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: `{"error": "BAD USERNAME", "code": 1}`
      })

      setTimeout(() => {
        expect(typeof response.data).toEqual('object')
        expect(response.data.error).toBe('BAD USERNAME')
        expect(response.data.code).toBe(1)
        done()
      }, 100)
    })
  })

  test('should supply correct response', done => {
    let response: AxiosResponse

    axios.post('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: `{"foo": "bar"}`,
        responseHeaders: {
          'Content-Type': 'application/json'
        }
      })
    })

    setTimeout(() => {
      expect(response.data.foo).toBe('bar')
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.headers['content-type']).toBe('application/json')
      done()
    }, 100)
  })

  test('should allow overriding Content-Type header case-insensitive', () => {
    let response: AxiosResponse

    axios
      .post('/foo', { prop: 'value' }, { headers: { 'content-type': 'application/json' } })
      .then(res => {
        response = res
      })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['Content-Type']).toBe('application/json')
    })
  })

  test('should support array buffer response', done => {
    let response: AxiosResponse

    function str2ab(str: string) {
      const buff = new ArrayBuffer(str.length * 2)
      const view = new Uint16Array(buff)
      for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i)
      }
      return buff
    }

    axios('/foo', {
      responseType: 'arraybuffer'
    }).then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        // @ts-ignore
        response: str2ab('Hello world')
      })

      setTimeout(() => {
        expect(response.data.byteLength).toBe(22)
        done()
      }, 100)
    })
  })
})
