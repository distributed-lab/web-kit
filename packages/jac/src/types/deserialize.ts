type AtLeastOneProperty<
  T,
  U = {
    [K in keyof T]: Pick<T, K>
  },
> = Partial<T> & U[keyof U]

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
