import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
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
      if (e.code == 'E_VALIDATION_FAILURE') {
        // TODO: Should be a better way to handle these
        return response.status(422).send(e.messages)
      }
      return response.status(500).json({
        message: 'Registration failed',
        error: e.message,
      })
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const { email, password } = await request.validate(LoginValidator)
      const token = await auth.use('api').attempt(email, password)

      return response.status(200).json(token)
    } catch (e: any) {
      if (e.code == 'E_VALIDATION_FAILURE') {
        // TODO: Should be a better way to handle these
        return response.status(422).send(e.messages)
      }
      return response.status(500).json({
        message: 'Login failed',
        error: e.message,
      })
    }
  }
}
