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

    test('should reject on network errors', done => {
      const resolveSpy = jest.fn((res: AxiosResponse) => {
        return res
      })

      const rejectSpy = jest.fn((e: AxiosError) => {
        return e
      })
      // 模拟网络出错
      jasmine.Ajax.uninstall()

      axios('/foo')
        .then(resolveSpy)
        .catch(rejectSpy)
        .then(next)

      function next(reason: AxiosResponse | AxiosError) {
        expect(rejectSpy).not.toHaveBeenCalled()
        expect(resolveSpy).toHaveBeenCalled()
        expect(reason instanceof Error).toBeTruthy()
        expect(reason as AxiosError).toBe('Network Error')
      }
    })
  })
})
