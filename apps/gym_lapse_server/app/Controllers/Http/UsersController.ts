import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ bouncer, params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)

      await bouncer.authorize('viewUser', user)
      return user
    } catch (error) {
      if (error.name == 'NotFoundException') {
        return response.status(404).send('User not found')
      }
      return response.status(500).send('Server error')
    }
  }
}
