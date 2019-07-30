import axios, { AxiosResponse, AxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helper'

describe('transform', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should transform JSON to string', () => {
    const data = {
      foo: 'bar'
    }

    axios.post('/foo', data)

    return getAjaxRequest().then(request => {
      expect(request.params).toBe('{"foo":"bar"}')
    })
  })

  test('should transform string to JSON', done => {
    axios('/foo').then(res => {
      expect(typeof res.data).toBe('object')
      expect(res.data.foo).toBe('bar')
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: '{"foo": "bar"}'
      })
    })
  })

  test('should override default transform', () => {
    const data = {
      foo: 'bar'
    }

    axios.post('/foo', data, {
      transformRequest(data) {
        return data
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.params).toEqual({ foo: 'bar' })
    })
  })

  test('should allow array of transformers', () => {
    const data = {
      foo: 'bar'
    }

    axios.post('foo', data, {
      transformRequest: (axios.defaults.transformRequest as AxiosTransformer[]).concat(function(
        data
      ) {
        return data.replace('bar', 'zlj')
      })
    })

    return getAjaxRequest().then(request => {
      expect(request.params).toBe('{"foo":"zlj"}')
    })
  })

  test('should allowing mutating headers', () => {
    const token = Math.floor(Math.random() * Math.pow(2, 64)).toString(36)

    axios('/foo', {
      transformRequest: (data, headers) => {
        headers['X-Authorization'] = token
        return data
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['X-Authorization']).toEqual(token)
    })
  })
})
