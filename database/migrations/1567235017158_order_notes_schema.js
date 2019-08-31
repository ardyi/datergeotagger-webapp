'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderNotesSchema extends Schema {
  up () {
    this.create('order_notes', (table) => {
      table.increments()
      table.integer('orderId').unsigned().nullable().references('orders.id')
      table.text('note').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('order_notes')
  }
}

module.exports = OrderNotesSchema
