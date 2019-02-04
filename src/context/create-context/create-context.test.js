const createContext = require('./create-context')

test('add to path should update the path', () => {
  let ctx = createContext({
    schema: {},
    value: null
  })

  ctx.addToPath('test')

  expect(ctx.path).toEqual([
    '$root',
    'test'
  ])
})

test('pop path should remove the last path item', () => {
  let ctx = createContext({
    schema: {},
    value: null
  })

  ctx.addToPath('test')
  ctx.addToPath('test-2')

  expect(ctx.path).toEqual([
    '$root',
    'test',
    'test-2'
  ])

  ctx.popPath()

  expect(ctx.path).toEqual([
    '$root',
    'test'
  ])
})

test('register errors must set the path and set valid as false', () => {
  let ctx = createContext({
    schema: {},
    value: null
  })

  ctx.addToPath('test')

  ctx.registerErrors({ test: true })

  expect(ctx.valid).toBeFalsy()
  expect(ctx.errors).toEqual({
    $root: {
      test: {
        test: true
      }
    }
  })
})

test('get error in path should return error if exist', () => {
  let ctx = createContext({
    schema: {
      $type: 'object',
      props: {
        role: {
          $type: 'object',
          props: {
            title: {
              $type: 'string'
            }
          }
        }
      }
    },
    value: {
      role: {
        title: null
      }
    }
  })

  ctx.validate()

  const error = ctx.getErrorInPath('$root.role.title.type')

  expect(error).toEqual({
    message: 'The value should be a string',
    value: null
  })
})