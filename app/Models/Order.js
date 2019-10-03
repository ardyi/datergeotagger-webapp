'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')
const moment = use('moment')
const Encryption = use('Encryption')

class Order extends Model {
  static async storeOrder(cell){
    // console.log(await this.query().where('orderNumber', cell['Order Number']).fetch())
    // if(await this.query().where('orderNumber', cell['Order Number']).fetch() != null){
    //   console.log('orderNum exists?')
    //   return false
    // }
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
              orderStatus: 2,
              // createBy: 1,
            }, trx)
          await trx.commit()
          return true
        } catch (err) {
          console.log(err)
          await trx.rollback()
          return false
        }
  }

  static async updateOrder(request){
    const trx = await Database.beginTransaction()
      try {
        const order =
        await this
          .query()
          .where('id', request.body.id)
          .update({
            orderStatus: request.body.status
          }, trx)
        await trx.commit()
        return true
      } catch (err) {
        console.log(err)
        await trx.rollback()
        return false
      }
  }

  static scopeSearchOrder(query, searchString){
    searchString = searchString ? searchString : ''
    query.where(function () {
      this
        .orWhere('orderNumber', 'LIKE', `%${searchString}%`)
        .orWhere('address', 'LIKE', `%${searchString}%`)
        .orWhere('city', 'LIKE', `%${searchString}%`)
        .orWhere('state', 'LIKE', `%${searchString}%`)
        .orWhere('zipCode', 'LIKE', `%${searchString}%`)
    })
    return query
  }

  static get computed () {
    return [
    'encryptedId',
    ]
  }

  getEncryptedId ({ id }) {
      return Encryption.encrypt(id)
  }
}

module.exports = Order
