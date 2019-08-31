'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateUsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('firstName').nullable()
      table.string('lastName').nullable()
      table.string('email').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = CreateUsersSchema
