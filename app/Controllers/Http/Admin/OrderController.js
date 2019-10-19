'use strict'
const XLSX = use('xlsx')
const fs = use('fs')
const moment = use('moment')

const Order = use('App/Models/Order')
const OrderStatus = use('App/Models/OrderStatus')
const OrderNote = use('App/Models/OrderNote')

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
    const orderStatuses = await OrderStatus.query().fetch()
    // console.log(orderStatuses.toJSON())
    return view
      .render('Admin.orders', {
        orderStatuses: orderStatuses.toJSON()
      })
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
      .where('orderStatus', 4)
      .orderBy('updated_at', 'desc')
      .paginate(request.input('page'), 10)
    return view
      .render('Admin.tables.table_closed_orders', {
        result: toDoOrders.toJSON(),
      })
  }

  async fetchOrders({ request, view, response }){
    const { page, search, sortColumn, orderBy, toFetch} = request.post()
    let fetchBy
    fetchBy = toFetch == 'All' ? 2 : toFetch == 'Todo' ? 3 : toFetch == 'Closed' ? 5 : 0
    const toDoOrders = await Order
      .query()
      .where('orderStatus', fetchBy)
      .SearchOrder(search)
      .orderBy(sortColumn, orderBy)
      .paginate(page, 10)
    return view
      .render('Admin.tables.table_closed_orders', {
        result: toDoOrders.toJSON(),
      })
  }

  async orderUpdate({ request, view, response }){
    const id = await Order.updateOrder(request)
    return id ? await OrderNote.storeNote(request) : false
  }
}

module.exports = OrderController
