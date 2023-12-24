import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

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
    assert.exists(response.body().user.id)
    assert.exists(response.body().token.token)
    assert.exists(response.body().token.type)
  })

  test('register with existing email', async ({ client }) => {
    const user = new User()
    user.email = 'test@test.com'
    user.password = 'password'
    await user.save()

    const response = await client.post('/register').json({
      email: 'test@test.com',
      password: 'password',
    })

    response.assertStatus(422)
    response.assertBody({
      errors: [
        {
          rule: 'unique',
          field: 'email',
          message: 'email is already in use',
        },
      ],
    })
  })
})
