'use strict'
const XLSX = use('xlsx')
const fs = use('fs')
const moment = use('moment')

const Order = use('App/Models/Order')

class OrderController {
  async index({
    view
  }) {
    return view
      .render('Admin.index', {})
  }

  async orders({
    view
  }) {
    return view
      .render('Admin.orders', {})
  }

  async uploadFile({
    request,
    view,
    response
  }) {
    // console.log('testuploadfile')

    const file = request.file('fileupload', {
      // types: ['image', 'video'],
      // types: ['application'],
      extnames: ['xlsx', 'xls', 'csv']
    })

    if (file != null) {

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
        var workbook = XLSX.readFile('tmp/uploads/' + file.clientName, {
          raw: true
        })
        var sheet_name_list = workbook.SheetNames
        var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
        fs.unlinkSync('tmp/uploads/' + file.clientName)

        for (let cell of data) {
          await Order.storeOrder(cell)
        }

      } catch (error) {
        console.log(error)
      }
    }
  }

  async fetchAllOrders({
    request,
    view,
    response
  }) {
    const orders = await Order
      .query()
      .where('orderStatus', 2)
      .SearchOrder(request.input('search'))
      .paginate(request.input('page'), 10)
    return view
      .render('Admin.tables.table_all_orders', {
        result: orders.toJSON(),
      })
  }

  async fetchTodoOrders({
    request,
    view,
    response
  }) {
    const toDoOrders = await Order
      .query()
      .where('orderStatus', 3)
      .orderBy('updated_at', 'desc')
      .paginate(request.input('page'), 10)
    return view
      .render('Admin.tables.table_todo_orders', {
        result: toDoOrders.toJSON(),
      })
  }

  async fetchClosedOrders({
    request,
    view,
    response
  }) {
    const toDoOrders = await Order
      .query()
      .where('orderStatus', 3)
      .orderBy('updated_at', 'desc')
      .paginate(request.input('page'), 10)
    return view
      .render('Admin.tables.table_todo_orders', {
        result: toDoOrders.toJSON(),
      })
  }

  async orderStatusUpdate({ request, view, response }){
    return await Order.assignTodo(request)
  }
}

module.exports = OrderController
