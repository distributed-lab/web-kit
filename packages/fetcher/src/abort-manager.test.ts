import { FetcherAbortManager } from './abort-manager'

describe('performs FetcherAbortManager unit test', () => {
  test('should create a new FetcherAbortManager', () => {
    const manager = new FetcherAbortManager()
    expect(manager).toBeInstanceOf(FetcherAbortManager)
  })

  test('should set a new AbortController', () => {
    const manager = new FetcherAbortManager()
    const controller = manager.set('test')
    expect(controller).toBeInstanceOf(AbortController)
  })

  test('should get an AbortController', () => {
    const manager = new FetcherAbortManager()
    const controller = manager.set('test')
    expect(manager.get('test')).toBe(controller)
  })

  test('should return undefined if AbortController does not exist', () => {
    const manager = new FetcherAbortManager()
    expect(manager.get('test')).toBeUndefined()
  })

  test('should return true if AbortController exists', () => {
    const manager = new FetcherAbortManager()
    manager.set('test')
    expect(manager.has('test')).toBeTruthy()
  })

  test('should return false if AbortController does not exist', () => {
    const manager = new FetcherAbortManager()
    expect(manager.has('test')).toBeFalsy()
  })

  test('should return true if AbortController is cleared', () => {
    const manager = new FetcherAbortManager()
    manager.set('test')
    expect(manager.clear('test')).toBeTruthy()
  })

  test('should return false if AbortController is not cleared', () => {
    const manager = new FetcherAbortManager()
    expect(manager.clear('test')).toBeFalsy()
  })

  test('should return true if AbortController is aborted', () => {
    const manager = new FetcherAbortManager()
    manager.set('test')
    expect(manager.abort('test')).toBeTruthy()
  })

  test('should return false if AbortController is not aborted', () => {
    const manager = new FetcherAbortManager()
    expect(manager.abort('test')).toBeFalsy()
  })

  test('should return null if no requestId is provided', () => {
    const manager = new FetcherAbortManager()
    expect(manager.setSafe()).toBeNull()
  })

  test('should return AbortSignal if requestId is provided', () => {
    const manager = new FetcherAbortManager()
    const signal = manager.setSafe('test')
    expect(signal).toBeInstanceOf(AbortSignal)
  })
})
