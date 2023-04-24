import {
  TAnyKeyValueObject,
  TDeserializeOptions,
  TJsonApiBody,
  TJsonApiData,
  TJsonApiLinks,
  TModel,
  TRelationships,
  TResourceIdObj,
} from '@/types'

const RELATIONSHIP_NAMES_PROP = 'relationshipNames'

const jsonParse = (str: string): object => {
  let parsed

  try {
    parsed = JSON.parse(str)
  } catch (e) {
    parsed = {}
    console.warn(e)
  }

  return parsed
}

const jsonStringify = (json: TAnyKeyValueObject): string => {
  let stringified

  try {
    stringified = JSON.stringify(json)
  } catch (e) {
    stringified = ''
    console.warn(e)
  }

  return stringified
}

class JsonPropertiesMapper {
  createModel(type: string): TModel {
    return { type }
  }

  setId(model: TModel, id: string | number): void {
    model.id = id
  }

  setAttributes(model: TModel, attributes: TAnyKeyValueObject): void {
    Object.keys(attributes).forEach(propName => {
      model[propName] = attributes[propName]
    })
  }

  setMeta(model: TModel, meta: TAnyKeyValueObject): void {
    model.meta = meta
  }

  setLinks(model: TModel, links: TJsonApiLinks): void {
    model.links = links
  }

  setResourceIdObjMeta(model: TModel, meta: TResourceIdObj): void {
    model.resourceIdObjMeta = meta
  }

  setRelationships(model: TModel, relationships: TRelationships) {
    Object.keys(relationships).forEach(propName => {
      if (typeof relationships[propName] === 'function') {
        relationships[propName]
      } else {
        model[propName] = relationships[propName]
      }
    })

    const newNames = Object.keys(relationships)
    const currentNames = model[RELATIONSHIP_NAMES_PROP]

    if (currentNames && Object.keys(currentNames).length) {
      model[RELATIONSHIP_NAMES_PROP] = [
        { ...currentNames },
        ...newNames,
      ].filter((value, i, self) => self.indexOf(value) === i)
    } else {
      model[RELATIONSHIP_NAMES_PROP] = newNames
    }
  }
}

class DeserializeCache {
  cachedModels: {
    [key: string]: TModel
  } = {}

  getCachedModel(
    data: TJsonApiData,
    resourceIdObject?: TResourceIdObj,
  ): TModel | null {
    const entityKey = this.createCacheKey(data, resourceIdObject)

    return this.cachedModels[entityKey] || null
  }

  handleModel(
    model: TModel,
    data: TJsonApiData,
    resourceIdObject?: TResourceIdObj,
  ): void {
    const entityKey = this.createCacheKey(data, resourceIdObject)
    const dataWithPayload = data.attributes || data.relationships

    if (entityKey && dataWithPayload) {
      this.cachedModels[entityKey] = model
    }
  }

  createCacheKey(
    data: TJsonApiData,
    resourceIdObject?: TResourceIdObj,
  ): string {
    // resourceIdObject.meta sets to model in simplePropertyMappers.ts, so it should be used here too
    // cache in this case probably will be redundant
    if (!data.id || !data.type) {
      return ''
    }

    let resourcePart = resourceIdObject
      ? `${resourceIdObject.type}-${resourceIdObject.id}`
      : ''

    if (resourceIdObject?.meta) {
      resourcePart += `-${jsonStringify(
        resourceIdObject.meta as TAnyKeyValueObject,
      )}`
    }

    if (data.meta) {
      return `${data.type}-${data.id}-${jsonStringify(
        data.meta,
      )}-${resourcePart}`
    }

    return `${data.type}-${data.id}-${resourcePart}`
  }
}

export class JsonDeserializer {
  #pm: JsonPropertiesMapper
  #dc: DeserializeCache
  #body: TJsonApiBody
  #dataInObject: { [key: string]: TJsonApiData }
  #preferNestedDataFromData = false
  #includedInObject: { [key: string]: TJsonApiData } | undefined

  constructor(
    propertiesMapper: JsonPropertiesMapper,
    deserializeCache: DeserializeCache,
    options?: TAnyKeyValueObject,
  ) {
    this.#pm = propertiesMapper
    this.#dc = deserializeCache
    this.#body = {}
    this.#dataInObject = {}
    this.#includedInObject = undefined

    if (!options) {
      return
    }

    if (options.preferNestedDataFromData) {
      this.#preferNestedDataFromData = true
    }
  }

  setJsonParsedObject(body: TJsonApiBody) {
    this.#body = body
  }

  build(): TModel | TModel[] {
    const { data } = this.#body as { data: TJsonApiData | TJsonApiData[] }
    let result

    if (Array.isArray(data)) {
      result = []
      for (let i = 0; i < data.length; i++) {
        if (!data[i]) {
          continue
        }

        const model = this.#buildModelByData(data[i])

        if (model) {
          result.push(model)
        }
      }
    } else if (data) {
      result = this.#buildModelByData(data)
    }

    return result as TModel | TModel[]
  }

  #buildModelByData(data: TJsonApiData, resourceIdObj?: TResourceIdObj) {
    const cachedModel = this.#dc.getCachedModel(data, resourceIdObj)

    if (cachedModel) {
      return cachedModel
    }

    const model = this.#pm.createModel(data.type)
    this.#dc.handleModel(model, data, resourceIdObj) // should be called before this.#pm.setRelationships(model, relationships);

    if (!model) return model

    this.#pm.setId(model, data.id as string | number)

    if (data.attributes) {
      this.#pm.setAttributes(model, data.attributes)
    }

    if (data.meta && this.#pm.setMeta) {
      this.#pm.setMeta(model, data.meta)
    }

    if (data.links && this.#pm.setLinks) {
      this.#pm.setLinks(model, data.links)
    }

    if (resourceIdObj?.meta) {
      this.#pm.setResourceIdObjMeta(model, resourceIdObj.meta as TResourceIdObj)
    }

    const relationships = this.#buildRelationsByData(data)
    if (relationships) {
      this.#pm.setRelationships(model, relationships)
    }

    return model
  }

  #buildRelationsByData(data: TJsonApiData): TRelationships | null {
    const readyRelations = {} as TRelationships
    const relationships = data.relationships

    if (!relationships) return null

    Object.keys(relationships).forEach(k => {
      const relation = relationships[k]
      const relationData = relation.data

      if (relationData === null) readyRelations[k] = {}

      if (Array.isArray(relationData)) {
        readyRelations[k] = [] as TModel[]

        relationData.forEach(resourceIdObj => {
          if (!resourceIdObj) return

          const dataItem = this.#buildDataFromIncludedOrData(
            resourceIdObj.id,
            resourceIdObj.type,
          )

          ;(readyRelations[k] as TModel[]).push(
            this.#buildModelByData(dataItem, resourceIdObj),
          )
        })
      } else if (relationData) {
        const dataItem = this.#buildDataFromIncludedOrData(
          relationData.id,
          relationData.type,
        )

        readyRelations[k] = this.#buildModelByData(dataItem, relationData)
      }
    })

    if (Object.keys(readyRelations).length) {
      return readyRelations
    }

    return null
  }

  #buildDataFromIncludedOrData(
    id: string | number,
    type: string,
  ): TJsonApiData {
    if (this.#preferNestedDataFromData) {
      const dataObject = this.#buildDataInObject()
      const dataItemFromData = dataObject[type + id]

      if (dataItemFromData) {
        return dataItemFromData
      }
    }

    const includedObject = this.#buildIncludedInObject()
    const dataItemFromIncluded = includedObject[type + id]

    if (dataItemFromIncluded) {
      return dataItemFromIncluded
    }

    if (!this.#preferNestedDataFromData) {
      const dataObject = this.#buildDataInObject()
      const dataItemFromData = dataObject[type + id]

      if (dataItemFromData) {
        return dataItemFromData
      }
    }

    return { id, type }
  }

  #buildDataInObject(): { [key: string]: TJsonApiData } {
    const { data } = this.#body as { data: TJsonApiData[] | TJsonApiData }

    if (this.#dataInObject || !data) return this.#dataInObject

    this.#dataInObject = {}

    if (!Array.isArray(data)) {
      this.#dataInObject[data.type + data.id] = data
      return this.#dataInObject
    }

    ;(data as TJsonApiData[]).forEach(item => {
      this.#dataInObject[item.type + item.id] = item
    })

    return this.#dataInObject
  }

  #buildIncludedInObject(): { [key: string]: TJsonApiData } {
    if (this.#includedInObject) return this.#includedInObject

    this.#includedInObject = {}

    if (!this.#body.included && !Array.isArray(this.#body.included)) {
      return this.#includedInObject
    }

    this.#body.included.forEach(item => {
      this.#includedInObject![item.type + item.id] = item
    })

    return this.#includedInObject
  }
}

export const deserialize = (
  body: TJsonApiBody | string,
  options?: TDeserializeOptions,
): TModel | Array<TModel> => {
  if (!body) {
    throw new TypeError("Can't be deserialized, body is not passed")
  }

  const deserializeCache = new DeserializeCache()
  const modelBuilder = new JsonDeserializer(
    new JsonPropertiesMapper(),
    deserializeCache,
    options,
  )

  const _body =
    typeof body === 'string'
      ? (jsonParse(body) as { [key: string]: TJsonApiData })
      : body

  modelBuilder.setJsonParsedObject(_body)

  return modelBuilder.build()
}
