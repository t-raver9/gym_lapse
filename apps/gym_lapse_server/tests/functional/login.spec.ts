import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

test.group('Login', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('login a user', async ({ client, assert }) => {
    const user = new User()
    user.email = 'test@test.com'
    user.password = 'password'
    await user.save()

    const response = await client.post('/login').json({
      email: 'test@test.com',
      password: 'password',
    })

    assert.exists(response.body().token)
    assert.exists(response.body().type)
  })
})
