import Cancel, { isCancel } from '../../src/cancel/Cancel'

describe('cancel:Cancel', () => {
  test('should returns correct result when message is specified', () => {
    const cancel = new Cancel('Operation has been cancel.')
    expect(cancel.message).toBe('Operation has been cancel.')
  })

  test('should returns true if value is a Cancel', () => {
    expect(isCancel(new Cancel())).toBeTruthy()
  })

  test('should returns false if value us not a cancel', () => {
    expect(isCancel({ foo: 'bar' })).toBeFalsy()
  })
})
