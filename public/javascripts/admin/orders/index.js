const URL = `${APP_URL}/admin/orders`
var toFetch = 'All';
var currentPage = 1;
var toSort = 'id';
var orderBy ='asc';

$(() => {
  paginate(currentPage, $('#searchString').val());
  $(document).on('click', '#btn-upload', ()=>{
    uploadFile();
  })
  $(document).on('click', '#all-order', ()=>{
    toFetch = 'All';
    paginate(1, $('#searchString').val());
  })
  $(document).on('click', '#todo-order', ()=>{
    toFetch = 'Todo';
    paginate(1, $('#searchString').val());
  })
  $(document).on('click', '#closed-order', ()=>{
    toFetch = 'Closed';
    paginate(1, $('#searchString').val());
  })
  $(document).on('keyup', '#searchString', (key) => {
    // console.log(key)
    if (key.keyCode == 13) {
      paginate(1, $('#searchString').val());
    }
  })
})


function showUpdateModal(order_id){
  $('#update_orderId').val(order_id);
  $('#update_modal').modal('toggle');
}

function updateOrder(){
  var id = $('#update_orderId').val();
  var status = $('#update_orderStatus').val();
  var notes = $('#orderNotes').val();
  ajaxRequest(`${URL}/orderUpdate`, {
    status: status,
    id: id,
    notes: notes,
  })
  .then(res => {
    fetchOrders(currentPage);
    $('#update_modal').modal('toggle');
      console.log(res)
  })
}

function uploadFile(){
  ajaxRequestForm(`${URL}/uploadFile`, $('#UploadForm'))
  .then(res => {
    paginate(currentPage);
  });
}

function fetchOrders(page){
  ajaxRequest(`${URL}/fetch${toFetch}Orders`, {
    page: page,
  })
  .then(res => {
    $('#table-all-orders').html(res);
  })
}

function paginate(page, searchString){
  currentPage = page;
  // ajaxRequest(`${URL}/fetch${toFetch}Orders`, {
  ajaxRequest(`${URL}/fetchOrders`, {
    page: page,
    search: searchString,
    sortColumn: toSort,
    orderBy: orderBy,
    toFetch: toFetch
  })
  .then(res => {
    console.log(`#table-${toFetch.toLowerCase()}-orders`);
    $(`#table-${toFetch.toLowerCase()}-orders`).html(res);
  })
}

function orderSort(column){
  if(toSort == column){
    orderBy = orderBy == null ? 'asc' : orderBy == 'asc' ? 'desc' : 'asc';
  } 
  currentPage = 1;
  // console.log(orderBy + ' ' + column);
  toSort = column;
  paginate(currentPage, $('#searchString').val())
}

// function orderSortBy(sortOrder){
//   paginate(1, $('#searchString').val())

//   if($('#orderSortBy').text() == 'Ascending'){
//     orderBy = 'desc';
//     $('#orderSortBy').text('Descending');
//   } else {
//     orderBy = 'asc';
//     $('#orderSortBy').text('Ascending');
//   }
// }