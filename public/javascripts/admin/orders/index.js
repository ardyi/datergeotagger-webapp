const URL = `${APP_URL}/admin/orders`
var toFetch = 'All';
var currentPage = 1;

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
  ajaxRequest(`${URL}/fetch${toFetch}Orders`, {
    page: page,
    search: searchString,
  })
  .then(res => {
    $(`#table-${toFetch.toLowerCase()}-orders`).html(res);
  })
}