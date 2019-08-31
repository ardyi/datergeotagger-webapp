'use strict'
const XLSX = use('xlsx')
const fs = use('fs')
const moment = use('moment')

const Order = use('App/Models/Order')

class OrderController {
  async index({ view }){
    return view
      .render('Admin.index', {})
  }

  async orders({ view }){
    return view
      .render('Admin.orders', {})
  }

  async uploadFile({ request, view, response }){
    // console.log('testuploadfile')

    const file = request.file('fileupload', {
      // types: ['image', 'video'],
      // types: ['application'],
      extnames: ['xlsx', 'xls', 'csv']
    })

    if(file != null){

      await file.move('tmp/uploads', {
        name: file.clientName,
        overwrite: true
      })
      if (!file.moved()) {
        console.log('error upload?')
        return response.json({
          err: '2',
          msg: 'Upload failed'
        })
      }

      try {
        var workbook = XLSX.readFile('tmp/uploads/' + file.clientName, {raw: true})
        var sheet_name_list = workbook.SheetNames
        var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
        fs.unlinkSync('tmp/uploads/' + file.clientName)

        for(let cell of data) {
          // console.log(moment(cell.Due))

          console.log(await Order.storeOrder(cell))
          // console.log(moment(cell.Due).format("MMM Do YY"))
          // console.log(moment(t.setSeconds(cell.Due)).format("DD MM"))
          // console.log(cell['Completed Date'])
          // console.log(new Date(cell.Due))
        }
        
      } catch (error) {
        console.log(error)
      }
    }
  }

  async fetchAllOrders({ request, view, response }){
    const orders = await Order.query().paginate(1, 10)

    console.log(orders)

    return view
      .render('Admin.tables.all_orders', {
        orders: orders.toJSON(),
      })
  }
}

module.exports = OrderController
