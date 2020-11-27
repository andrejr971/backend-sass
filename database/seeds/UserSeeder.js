'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const User = use('App/Models/User')
const Role = use('Role')
const Permission = use('Permission')

class UserSeeder {
  async run() {
    const user = await User.create({
      name: 'André Junior',
      email: 'admin@admin.br',
      password: '1234567',
    })

    const createInvite = await Permission.create({
      slug: 'invites_create',
      name: 'Convidar membros',
    })

    const createProject = await Permission.create({
      slug: 'project_create',
      name: 'Criar projetos',
    })

    const admin = await Role.create({
      slug: 'administrator',
      name: 'Administrador',
    })

    const moderator = await Role.create({
      slug: 'moderator',
      name: 'Moderador',
    })

    await Role.create({
      slug: 'visitor',
      name: 'Visitante',
    })

    await admin.permissions().attach([createInvite.id, createProject.id])
    await moderator.permissions().attach([createProject.id])

    const team = await user.teams().create({
      name: 'Rockeseat',
      user_id: user.id,
    })

    const teamJoin = await user.teamJoins().where('team_id', team.id).first()

    await teamJoin.roles().attach([admin.id])
  }
}

module.exports = UserSeeder
