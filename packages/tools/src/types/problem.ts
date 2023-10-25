import type { EventBus } from '@/event-bus'

export type ProblemConfig<AdditionalEventBusMap extends object = object> = {
  eventBus?: EventBus<AdditionalEventBusMap>
}
