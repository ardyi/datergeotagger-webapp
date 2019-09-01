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

function updateStatus(status, id){
  ajaxRequest(`${URL}/orderStatusUpdate`, {
    status: status,
    id: id,
  })
  .then(res => {
    fetchOrders(currentPage);
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