type AtLeastOneProperty<
  T,
  U = {
    [K in keyof T]: Pick<T, K>
  },
> = Partial<T> & U[keyof U]

export interface IModelPropertiesMapper {
  getId(model: TModel): string | number
  getType(model: TModel): string
  getAttributes(model: TModel): TAnyKeyValueObject
  getRelationships(model: TModel): TRelationships
}

export interface IJsonPropertiesMapper {
  createModel(type: string): TModel
  setId(model: TModel, id: string | number): void
  setAttributes(model: TModel, attributes: TAnyKeyValueObject): void
  setMeta(model: TModel, meta: TAnyKeyValueObject): void
  setLinks(model: TModel, links: TAnyKeyValueObject): void
  setResourceIdObjMeta(model: TModel, meta: unknown): void
  setRelationships(model: TModel, relationships: TRelationships): void
}

export interface IModelBuilder {
  build(): TModel | Array<TModel>
}

export interface IDeserializeCache {
  getCachedModel(
    data: TJsonApiData,
    resourceIdObject: TResourceIdObj,
  ): TModel | null
  handleModel(
    model: TModel,
    data: TJsonApiData,
    resourceIdObject: TResourceIdObj,
  ): void
  createCacheKey(data: TJsonApiData, resourceIdObject: TResourceIdObj): string
}

export interface IModelsSerializer {
  setPropertiesMapper(propertiesMapper: IModelPropertiesMapper): unknown
  setStuff(stuff: unknown): unknown
  setIncludeNames(
    includeNames: TDenormalizedIncludeNames | TNormalizedIncludeNamesTree,
  ): unknown
  build(): TJsonApiBody
  buildDataByModel(model: TModel | null): TJsonApiData
  buildRelationshipsByModel(model: TModel): unknown
  buildIncludedByModel(
    model: TModel,
    includeTree: TNormalizedIncludeNamesTree,
    builtIncluded: TUniqueIncluded,
  ): void
  buildIncludedItem(
    relationModel: TModel,
    subIncludeTree: TNormalizedIncludeNamesTree,
    builtIncluded: TUniqueIncluded,
  ): unknown
}

export type TDeserializeOptions = {
  preferNestedDataFromData?: boolean
}

export type TAnyKeyValueObject = {
  [key: string]: unknown
}

export type TJsonApiBody = {
  data?: TJsonApiData | TJsonApiData[]
  included?: Array<TJsonApiData>
}

export type TJsonApiData = {
  type: string
  id?: string | number
  attributes?: TAnyKeyValueObject
  meta?: TAnyKeyValueObject
  links?: TJsonApiLinks
  relationships?: TJsonApiRelationships
}

export type TJsonApiRelationshipData = {
  type: string
  id: string | number
  meta?: TAnyKeyValueObject
}

type FullTJsonApiRelation = {
  data: TJsonApiRelationshipData | Array<TJsonApiRelationshipData> | null
  links: TJsonApiLinks
  meta: TAnyKeyValueObject
}

export type TJsonApiRelation = AtLeastOneProperty<FullTJsonApiRelation>

type LinkKey = 'self' | 'related' | 'first' | 'prev' | 'next' | 'last'

type LinkObjectMember =
  | string
  | {
      href?: string
      meta?: TAnyKeyValueObject
    }
  | null

export type TJsonApiLinks = {
  [key in LinkKey]?: LinkObjectMember
}

export type TJsonApiRelationships = {
  [relationName: string]: TJsonApiRelation
}

export type TUniqueIncluded = {
  [entityTypeId: string]: TJsonApiData
}

export type TIncludeNamesChain = string

export type TDenormalizedIncludeNames = Array<TIncludeNamesChain>

export type TNormalizedIncludeNamesTree = {
  [relationName: string]: null | TNormalizedIncludeNamesTree
}

export type TModel = {
  [propertyName: string]: unknown
}

export type TResourceIdObj = {
  id?: string | number
  type: string
  meta?: unknown
  [propertyName: string]: unknown
}

export type TRelationshipBuild = () => TModel | Array<TModel>

export type TRelationships = {
  [relationName: string]: TRelationshipBuild | TModel | Array<TModel>
}
