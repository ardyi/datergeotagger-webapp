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
Route.post('/admin/orders/fetchTodoOrders', 'Admin/OrderController.fetchTodoOrders')
Route.post('/admin/orders/fetchClosedOrders', 'Admin/OrderController.fetchClosedOrders')
Route.post('/admin/orders/fetchOrders', 'Admin/OrderController.fetchOrders')
Route.post('/admin/orders/orderUpdate', 'Admin/OrderController.orderUpdate')

//Images
Route.get('/admin/images', 'Admin/ImageController.index')
Route.post('/admin/images/datePhotos', 'Admin/ImageController.datePhotos')
Route.post('/admin/images/geotagPhotos', 'Admin/ImageController.geotagPhotos')