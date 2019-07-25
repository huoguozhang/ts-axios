import axios from '../src/index'
import { getAjaxRequest } from './helper'
const cancelMessage = 'Operation has been canceled.'
describe('cancel', () => {
  const CancelToken = axios.CancelToken
  const Cancel = axios.Cancel

  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  describe('when called before sending request', () => {
    test('should rejects Promise with a Cancel Object', () => {
      const source = CancelToken.source()
      source.cancel(cancelMessage)

      return axios
        .get('/foo', {
          cancelToken: source.token
        })
        .catch(reason => {
          expect(reason).toEqual(expect.any(Cancel))
          expect(reason.message).toBe(cancelMessage)
        })
    })
  })

  describe('when called after request has been sent', () => {
    test('should rejects Promise with a cancel object', done => {
      const source = CancelToken.source()
      axios.get('/foo/bar', { cancelToken: source.token }).catch(reason => {
        expect(reason).toEqual(expect.any(Cancel))
        expect(reason.message).toBe(cancelMessage)
        done()
      })

      getAjaxRequest().then(request => {
        source.cancel(cancelMessage)
        setTimeout(() => {
          request.respondWith({
            status: 200,
            responseText: 'OK'
          })
        }, 100)
      })
    })

    test('calls abort on request object', done => {
      const source = CancelToken.source()
      let request: any
      axios.get('/foo/bar', { cancelToken: source.token }).catch(() => {
        expect(request.statusText).toBe('abort')
        done()
      })
      getAjaxRequest().then(req => {
        source.cancel()
        request = req
      })
    })
  })

  describe('when called after response has benn received', () => {
    test('should not cause unhandled rejection', done => {
      const source = CancelToken.source()
      axios.get('/foo', { cancelToken: source.token }).then(() => {
        window.addEventListener('unhandledrejection', () => {
          done.fail('Unhandled rejection.')
        })
        source.cancel()
        setTimeout(done, 100)
      })

      getAjaxRequest().then(request => {
        request.respondWith({
          status: 200,
          responseText: 'OK'
        })
      })
    })
  })
})
