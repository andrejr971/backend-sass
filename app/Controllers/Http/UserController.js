'use strict'

const User = use('App/Models/User')
const Invite = use('App/Models/Invite')

class UserController {
  async store({ request, response, auth }) {
    const data = request.only(['name', 'email', 'password'])

    const teamQuery = Invite.query().where('email', data.email)
    const teams = await teamQuery.pluck('team_id')

    if (teams.length === 0) {
      return response.status(401).send({
        message: "You're not invited to any team.",
      })
    }

    const user = await User.create(data)

    await user.teams().attach(teams)

    await teamQuery.delete()

    const token = await auth.attempt(data.email, data.password)

    return token
  }
}

module.exports = UserController
