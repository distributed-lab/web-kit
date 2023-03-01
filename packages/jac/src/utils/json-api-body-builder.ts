import {
  JsonApiRecord,
  JsonApiRecordData,
  JsonApiAttributes,
  JsonApiRelationships,
} from '@/types'

export class JsonApiBodyBuilder {
  #body: JsonApiRecord

  constructor() {
    this.#body = {
      data: {
        type: '',
      },
    }
  }

  public setData<T extends string = string>(
    data: JsonApiRecordData<T>,
  ): JsonApiBodyBuilder {
    this.#body.data = data
    return this
  }

  public setIncluded(
    included: InstanceType<typeof JsonApiBodyBuilder>[],
  ): JsonApiBodyBuilder {
    this.#body.included = included.map(record => record.build())
    return this
  }

  public setType<T extends string = string>(type: T): JsonApiBodyBuilder {
    this.#body.data.type = type
    return this
  }

  public setID(id: string): JsonApiBodyBuilder {
    this.#body.data.id = id
    return this
  }

  public setAttributes(attributes: JsonApiAttributes): JsonApiBodyBuilder {
    this.#body.data.attributes = attributes
    return this
  }

  public setRelationships<T extends string = string>(
    relationships: JsonApiRelationships<T>,
  ): JsonApiBodyBuilder {
    this.#body.data.relationships = relationships
    return this
  }

  public build(): JsonApiRecord {
    const result: JsonApiRecord = { ...this.#body }
    return result
  }
}
