import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'
import { RegisterResponse } from '@shared/types/types'

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    try {
      const payload = await request.validate(RegisterValidator)
      const dbUser = await User.create(payload)
      const token = await auth.use('api').generate(dbUser)

      const registerResponse: RegisterResponse = {
        token: token,
        user: {
          id: dbUser.id,
          email: dbUser.email,
        },
      }

      return response.status(200).json(registerResponse)
    } catch (e: any) {
      return response.status(500).json({
        message: 'Registration failed',
        error: e.message,
      })
    }
  }
}
