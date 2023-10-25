import type { EventBus } from '@/events'

export type ProblemConfig<AdditionalEventBusMap extends object = object> = {
  eventBus?: EventBus<AdditionalEventBusMap>
}
