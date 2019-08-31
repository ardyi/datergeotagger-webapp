'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrdersSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()
      table.integer('orderNumber').nullable().unique()
      table.integer('orderStatus').unsigned().references('order_statuses.id')
      table.datetime('dueDate').nullable()
      table.text('workOrdered').nullable()
      table.text('address').nullable()
      table.text('city').nullable()
      table.string('state').nullable()
      table.string('zipCode').nullable()
      table.string('clientType').nullable()
      table.integer('createBy').unsigned().nullable().references('users.id')

      table.timestamps()
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrdersSchema
