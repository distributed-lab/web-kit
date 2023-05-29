import { EventEmitter } from '@distributedlab/tools'

import { PROVIDER_EVENT_BUS_EVENTS } from '@/enums'
import { ProviderEventBus } from '@/providers'

describe('performs unit test ProviderEventBus', () => {
  let eventBus: ProviderEventBus

  beforeEach(() => {
    eventBus = new ProviderEventBus()
  })

  afterEach(() => {
    eventBus.clearHandlers()
  })

  describe('Event Emitter', () => {
    test('should return the event emitter', () => {
      const emitter = eventBus.emitter

      expect(emitter).toBeInstanceOf(EventEmitter)
    })
  })

  describe('Emit Event', () => {
    test('should emit an event with the payload', () => {
      const mockEvent = PROVIDER_EVENT_BUS_EVENTS.Initiated
      const mockPayload = { address: 'mockData' }
      const emitSpy = jest.spyOn(eventBus.emitter, 'emit')

      eventBus.emit(mockEvent, mockPayload)

      expect(emitSpy).toHaveBeenCalledWith(mockEvent, mockPayload)
    })
  })

  describe('Event Handlers', () => {
    test('should register a handler for "BeforeTxSent" event', () => {
      const mockHandler = jest.fn()
      eventBus.onBeforeTxSent(mockHandler)

      eventBus.emit(PROVIDER_EVENT_BUS_EVENTS.BeforeTxSent, {})

      expect(mockHandler).toHaveBeenCalled()
    })

    test('should register a handler for "TxSent" event', () => {
      const mockHandler = jest.fn()
      eventBus.onTxSent(mockHandler)

      eventBus.emit(PROVIDER_EVENT_BUS_EVENTS.TxSent, {})

      expect(mockHandler).toHaveBeenCalled()
    })

    test('should register a handler for "TxConfirmed" event', () => {
      const mockHandler = jest.fn()
      eventBus.onTxConfirmed(mockHandler)

      eventBus.emit(PROVIDER_EVENT_BUS_EVENTS.TxConfirmed, {})

      expect(mockHandler).toHaveBeenCalled()
    })

    test('should register a handler for "Initiated" event', () => {
      const mockHandler = jest.fn()
      eventBus.onInitiated(mockHandler)

      eventBus.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, {})

      expect(mockHandler).toHaveBeenCalled()
    })

    test('should register a handler for "Connect" event', () => {
      const mockHandler = jest.fn()
      eventBus.onConnect(mockHandler)

      eventBus.emit(PROVIDER_EVENT_BUS_EVENTS.Connect, {})

      expect(mockHandler).toHaveBeenCalled()
    })

    test('should register a handler for "Disconnect" event', () => {
      const mockHandler = jest.fn()
      eventBus.onDisconnect(mockHandler)

      eventBus.emit(PROVIDER_EVENT_BUS_EVENTS.Disconnect, {})

      expect(mockHandler).toHaveBeenCalled()
    })

    test('should register a handler for "AccountChanged" event', () => {
      const mockHandler = jest.fn()
      eventBus.onAccountChanged(mockHandler)

      eventBus.emit(PROVIDER_EVENT_BUS_EVENTS.AccountChanged, {})

      expect(mockHandler).toHaveBeenCalled()
    })

    test('should register a handler for "ChainChanged" event', () => {
      const mockHandler = jest.fn()
      eventBus.onChainChanged(mockHandler)

      eventBus.emit(PROVIDER_EVENT_BUS_EVENTS.ChainChanged, {})

      expect(mockHandler).toHaveBeenCalled()
    })
  })

  describe('Clear Handlers', () => {
    it('should clear all event handlers', () => {
      const mockHandler = jest.fn()
      eventBus.onInitiated(mockHandler)
      eventBus.onConnect(mockHandler)
      eventBus.onDisconnect(mockHandler)
      eventBus.onAccountChanged(mockHandler)

      eventBus.clearHandlers()

      eventBus.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, {})
      eventBus.emit(PROVIDER_EVENT_BUS_EVENTS.Connect, {})
      eventBus.emit(PROVIDER_EVENT_BUS_EVENTS.Disconnect, {})
      eventBus.emit(PROVIDER_EVENT_BUS_EVENTS.AccountChanged, {})

      expect(mockHandler).not.toHaveBeenCalled()
    })
  })
})
