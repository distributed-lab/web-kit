import { JsonApiBodyBuilder } from './json-api-body-builder'
import { JsonApiRecord } from '../types'

describe('performs JsonApiBodyBuilder unit test', () => {
  describe('setData', () => {
    it('should set data to data property of body', () => {
      const body: JsonApiRecord = new JsonApiBodyBuilder()
        .setData({
          id: '120',
          type: 'book',
          attributes: {
            title: 'Blockchain Technology',
            part: '2',
          },
          relationships: {
            autor: {
              data: {
                id: '1',
                type: 'company',
              },
            },
          },
          links: {
            self: 'http://example.com/books/120',
            next: 'http://example.com/books',
            prev: 'http://example.com/books',
            last: 'http://example.com/books',
            first: 'http://example.com/books',
          },
        })
        .build()

      expect(body).toStrictEqual({
        data: {
          id: '120',
          type: 'book',
          attributes: {
            title: 'Blockchain Technology',
            part: '2',
          },
          relationships: {
            autor: {
              data: {
                id: '1',
                type: 'company',
              },
            },
          },
          links: {
            self: 'http://example.com/books/120',
            next: 'http://example.com/books',
            prev: 'http://example.com/books',
            last: 'http://example.com/books',
            first: 'http://example.com/books',
          },
        },
      })
    })
  })

  describe('setIncluded', () => {
    it('should set includedBook as array item to included property of body', () => {
      const includedBook: InstanceType<typeof JsonApiBodyBuilder> =
        new JsonApiBodyBuilder()
          .setID('9')
          .setType('book')
          .setAttributes({ title: 'Blockchain Technology', part: '3' })

      const body: JsonApiRecord = new JsonApiBodyBuilder()
        .setIncluded([includedBook])
        .build()

      expect(body).toStrictEqual({
        data: {
          type: '',
        },
        included: [
          {
            data: {
              id: '9',
              type: 'book',
              attributes: {
                title: 'Blockchain Technology',
                part: '3',
              },
            },
          },
        ],
      })
    })
  })

  describe('setType', () => {
    it('should set type to type property of data in body', () => {
      const body: JsonApiRecord = new JsonApiBodyBuilder()
        .setType('book')
        .build()

      expect(body).toStrictEqual({
        data: {
          type: 'book',
        },
      })
    })
  })

  describe('setID', () => {
    it('should set id to id propery of data in body', () => {
      const body: JsonApiRecord = new JsonApiBodyBuilder().setID('28').build()

      expect(body).toStrictEqual({
        data: {
          id: '28',
          type: '',
        },
      })
    })
  })

  describe('setAttributes', () => {
    it('should set attributes to attributes property of data in body', () => {
      const body: JsonApiRecord = new JsonApiBodyBuilder()
        .setAttributes({
          title: 'Blockchain Technology',
          part: '2',
        })
        .build()

      expect(body).toStrictEqual({
        data: {
          type: '',
          attributes: {
            title: 'Blockchain Technology',
            part: '2',
          },
        },
      })
    })
  })

  describe('setRelationships', () => {
    it('should set relationships to relationships property of data in body', () => {
      const body: JsonApiRecord = new JsonApiBodyBuilder()
        .setRelationships({
          autor: {
            data: {
              id: '1',
              type: 'company',
            },
          },
        })
        .build()

      expect(body).toStrictEqual({
        data: {
          type: '',
          relationships: {
            autor: {
              data: {
                id: '1',
                type: 'company',
              },
            },
          },
        },
      })
    })
  })
})
