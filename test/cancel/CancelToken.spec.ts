import CancelToken from '../../src/cancel/CancelToken'
import Cancel from '../../src/cancel/Cancel'
import { Canceler } from '../../src/types'
const cancelMessage = 'Operation has been canceled.'
describe('CancelToken', () => {
  describe('reason', () => {
    test('should returns a cancel if cancellation has been requested', () => {
      let cancel: Canceler
      let token = new CancelToken(c => {
        cancel = c
      })
      cancel!(cancelMessage)
      cancel!('Operation has been canceled')
      expect(token.reason).toEqual(expect.any(Cancel))
      expect(token.reason!.message).toBe(cancelMessage)
    })

    test('should returns undefined if cancellation has not been requested', () => {
      const token = new CancelToken(() => {})
      expect(token.reason).toBeUndefined()
    })
  })

  describe('promise', () => {
    test('should returns a Promise that resolves when cancellation is requested', done => {
      let cancel: Canceler
      const token = new CancelToken(c => {
        cancel = c
      })
      token.promise.then(value => {
        expect(value).toEqual(expect.any(Cancel))
        expect(value.message).toBe(cancelMessage)
        done()
      })
      cancel!(cancelMessage)
    })
  })

  describe('throwIfRequested', () => {
    test('should throws if cancellation has been requested', () => {
      let cancel: Canceler
      const token = new CancelToken(c => {
        cancel = c
      })
      cancel!(cancelMessage)
      try {
        token.throwIfRequested()
        fail('Expected throwIfRequested to throw.')
      } catch (e) {
        if (!(e instanceof Cancel)) {
          fail('Expected throwIfRequested to throw a Cancel, but test threw ' + e + '.')
        }
        expect(e.message).toBe(cancelMessage)
      }
    })

    test('should does not throw if cancellation has not been requested', () => {
      const token = new CancelToken(() => {})
      token.throwIfRequested()
    })
  })

  describe('source', () => {
    test('should returns an object containing token and cancel function', () => {
      const source = CancelToken.source()
      expect(source.token).toEqual(expect.any(CancelToken))
      expect(source.cancel).toEqual(expect.any(Function))
      expect(source.token.reason).toBeUndefined()
      source.cancel(cancelMessage)
      expect(source.token.reason).toEqual(expect.any(Cancel))
      expect(source.token.reason!.message).toBe(cancelMessage)
    })
  })
})
