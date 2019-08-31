'use strict'

/*
|--------------------------------------------------------------------------
| BaseDatumSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')
const OrderStatus = use('App/Models/OrderStatus')

class BaseDatumSeeder {
  async run () {
    let user = new User()
    user.firstName = 'Reymund John'
    user.lastName = 'Pagdanganan'
    user.email = 'reymund.pagdanganan@holbornassets.com'
    await user.save()

    let orderStatus = new OrderStatus()
    orderStatus.statusName = 'other'
    await orderStatus.save()

    orderStatus = new OrderStatus()
    orderStatus.statusName = 'new'
    await orderStatus.save()

    orderStatus = new OrderStatus()
    orderStatus.statusName = 'todo'
    await orderStatus.save()

    orderStatus = new OrderStatus()
    orderStatus.statusName = 'pending close'
    await orderStatus.save()

    orderStatus = new OrderStatus()
    orderStatus.statusName = 'closed'
    await orderStatus.save()

    orderStatus = new OrderStatus()
    orderStatus.statusName = 'reopened'
    await orderStatus.save()
  }
}

module.exports = BaseDatumSeeder
