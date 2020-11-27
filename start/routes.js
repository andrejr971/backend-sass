'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('session', 'SessionController.store').validator('Session')
Route.post('users', 'UserController.store').validator('User')

Route.group(() => {
  Route.get('roles', 'RoleController.index')

  Route.resource('teams', 'TeamController')
    .apiOnly()
    .validator(new Map([[['teams.store', 'teams.update'], ['Team']]]))
}).middleware('auth')

Route.group(() => {
  Route.post('invites', 'InviteController.store')
    .validator('Invite')
    .middleware('can:invites_create')

  Route.resource('projects', 'ProjectController')
    .validator(new Map([[['projects.store', 'projects.update'], ['Project']]]))
    .middleware(new Map([[['projects.store', 'projects.update'], ['can:project_create']]]))

  Route.get('members', 'MemberController.index')
  Route.put('members/:id', 'MemberController.update').middleware('is:administrator')

  Route.get('permissions', 'PermissionController.show')
}).middleware(['auth', 'team'])
