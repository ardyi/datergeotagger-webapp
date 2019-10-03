'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class OrderNote extends Model {
  static async storeNote(request) {
    const trx = await Database.beginTransaction()
        try {
          if(await this.findBy('orderId', request.body.id)){
            console.log('updating')
            await this
              .query()
              .where('orderId', request.body.id)
              .update({
                note: request.body.notes
              }, trx)
          } else {
            console.log('creating')
            await this
            .create({
              orderId: request.body.id,
              note: request.body.notes
            }, trx)
          }
          await trx.commit()
          return true
        } catch (err) {
          console.log(err)
          await trx.rollback()
          return false
        }
  }
}

module.exports = OrderNote
