import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Register user', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('register a user', async ({ client, assert }) => {
    const response = await client.post('/register').json({
      email: 'test@test.com',
      password: 'password',
    })

    response.assertBodyContains({
      user: {
        email: 'test@test.com',
      },
    })
    assert.exists(response.body().user.id, 'Response body does not have an id field')
    assert.exists(response.body().token.token, 'Response body does not have an id field')
    assert.exists(response.body().token.type, 'Response body does not have an id field')
  })
})
