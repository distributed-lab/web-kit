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

      const handler = (data: string) => {
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
    const eventEmitter = new EventEmitter<{ foo: string }>()

    const handler = (data: string) => {
      expect(data).toBe('bar')
    }

    eventEmitter.on('foo', handler)
    eventEmitter.emit('foo', 'bar')
    eventEmitter.off('foo', handler)

    expect(
      eventEmitter?.handlers?.foo?.find(i => i === handler),
    ).toBeUndefined()
  })
})
