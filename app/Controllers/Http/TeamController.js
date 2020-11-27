'use strict'

const Role = use('Role')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/sr') */

class TeamController {
  async index({ auth }) {
    const teams = await auth.user.teams().fetch()

    return teams
  }

  async store({ request, auth }) {
    const data = request.only(['name'])

    const teams = await auth.user.teams().create({
      ...data,
      user_id: auth.user.id,
    })

    const teamJoin = await auth.user.teamJoins().where('team_id', teams.id).first()

    const admin = await Role.findBy('slug', 'administrator')

    await teamJoin.roles().attach([admin.id])

    return teams
  }

  async show({ params, auth }) {
    const team = await auth.user.teams().where('teams.id', params.id).first()

    return team
  }

  async update({ params, request, auth }) {
    const data = request.only(['name'])

    const team = await auth.user.teams().where('teams.id', params.id).first()

    team.merge(data)

    await team.save()

    return team
  }

  async destroy({ params, auth }) {
    const team = await auth.user.teams().where('teams.id', params.id).first()

    await team.delete()
  }
}

module.exports = TeamController
