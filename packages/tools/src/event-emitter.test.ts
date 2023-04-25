import { EventEmitter } from './event-emitter'

describe('performs EventEmitter unit test', () => {
  describe('performs on', () => {
    test('should call registered handler', () => {
      const eventEmitter = new EventEmitter<{ foo: string }>()

      eventEmitter.on('foo', data => {
        expect(data).toBe('bar')
      })

      eventEmitter.emit('foo', 'bar')
    })

    test('should call registered handler with no params', () => {
      const eventEmitter = new EventEmitter<{ foo: undefined }>()

      eventEmitter.on('foo', () => {
        expect(true).toBe(true)
      })

      eventEmitter.emit('foo')
    })

    test('should call multiple registered handlers', () => {
      const eventEmitter = new EventEmitter<{ foo: string }>()

      let i = 0

      eventEmitter.on('foo', data => {
        expect(data).toBe('bar')
        i++
      })

      eventEmitter.on('foo', data => {
        expect(data).toBe('bar')
        expect(i).toBe(1)
      })

      eventEmitter.emit('foo', 'bar')
    })
  })

  describe('performs once, should call handler once', () => {
    test('should call handler once', () => {
      const eventEmitter = new EventEmitter<{ foo: string }>()

      const handler = (data?: string) => {
        expect(data).toBe('bar')
      }

      eventEmitter.once('foo', handler)
      eventEmitter.emit('foo', 'bar')

      expect(
        eventEmitter?.handlers?.foo?.find(i => i === handler),
      ).toBeUndefined()
    })
  })

  describe('performs off, should unregister handler', () => {
    test('should off events', () => {
      const eventEmitter = new EventEmitter<{ foo: string; bar: undefined }>()

      const handler = (data?: string) => {
        expect(data).toBe('bar')
      }

      const barHandler = () => {
        expect(true).toBe(true)
      }

      eventEmitter.on('foo', handler)
      eventEmitter.emit('foo', 'bar')
      eventEmitter.off('foo', handler)

      eventEmitter.on('bar', barHandler)
      eventEmitter.emit('bar')
      eventEmitter.off('bar', barHandler)

      expect(
        eventEmitter?.handlers?.foo?.find(i => i === handler),
      ).toBeUndefined()
    })
  })
})
