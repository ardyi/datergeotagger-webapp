'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')
const moment = use('moment')

class Order extends Model {

  static async storeOrder(cell){
    console.log(moment(cell['Due']).format('YYYY-MM-DD HH:mm:ss'))
    const trx = await Database.beginTransaction()
        try {
            await this
            .create({
              orderNumber: cell['Order Number'],
              dueDate: moment(cell['Due']).format("YYYY-MM-DD HH:mm:ss"),
              workOrdered: cell['Work Ordered'],
              address: cell['Address'],
              city: cell['City'],
              state: cell['State'],
              zipCode: cell['Zip'],
              clientType: cell['Client'],
              // createBy: 1,
            }, trx)
          await trx.commit()
          return true
        } catch (err) {
          await trx.rollback()
          return false
        }
  }
}

module.exports = Order
