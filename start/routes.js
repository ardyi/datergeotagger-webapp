'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.on('/').render('login')

Route.get('/', 'Admin/OrderController.index')

//Orders
Route.get('/admin/orders', 'Admin/OrderController.orders')
Route.post('/admin/orders/uploadFile', 'Admin/OrderController.uploadFile')
Route.post('/admin/orders/fetchAllOrders', 'Admin/OrderController.fetchAllOrders')
