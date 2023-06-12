import { newFetcherAbortManager } from './abort-manager'

describe('performs FetcherAbortManager unit test', () => {
  test('should get an AbortController', () => {
    const manager = newFetcherAbortManager()
    const controller = manager.set('test')
    expect(manager.get('test')).toBe(controller)
  })

  test('should return undefined if AbortController does not exist', () => {
    const manager = newFetcherAbortManager()
    expect(manager.get('test')).toBeUndefined()
  })

  test('should return true if AbortController exists', () => {
    const manager = newFetcherAbortManager()
    manager.set('test')
    expect(manager.has('test')).toBeTruthy()
  })

  test('should return false if AbortController does not exist', () => {
    const manager = newFetcherAbortManager()
    expect(manager.has('test')).toBeFalsy()
  })

  test('should return true if AbortController is cleared', () => {
    const manager = newFetcherAbortManager()
    manager.set('test')
    expect(manager.clear('test')).toBeTruthy()
  })

  test('should return false if AbortController is not cleared', () => {
    const manager = newFetcherAbortManager()
    expect(manager.clear('test')).toBeFalsy()
  })

  test('should return true if AbortController is aborted', () => {
    const manager = newFetcherAbortManager()
    manager.set('test')
    expect(manager.abort('test')).toBeTruthy()
  })

  test('should return false if AbortController is not aborted', () => {
    const manager = newFetcherAbortManager()
    expect(manager.abort('test')).toBeFalsy()
  })

  test('should return null if no requestId is provided', () => {
    const manager = newFetcherAbortManager()
    expect(manager.setSafe()).toBeNull()
  })

  test('should return AbortSignal if requestId is provided', () => {
    const manager = newFetcherAbortManager()
    const signal = manager.setSafe('test')
    expect(signal).toBeInstanceOf(AbortSignal)
  })
})
