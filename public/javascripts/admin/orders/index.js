const URL = `${APP_URL}/admin/orders`
var toFetch = 'All';
var currentPage = 1;

$(() => {
  paginate(currentPage);
  $(document).on('click', '#btn-upload', ()=>{
    uploadFile();
  })
  $(document).on('click', '#all-order', ()=>{
    toFetch = 'All';
    paginate(currentPage);
  })
  $(document).on('click', '#todo-order', ()=>{
    toFetch = 'Todo';
    paginate(currentPage);
  })
})

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

function paginate(page){
  currentPage = page;
  ajaxRequest(`${URL}/fetch${toFetch}Orders`, {
    page: page,
  })
  .then(res => {
    $(`#table-${toFetch.toLowerCase()}-orders`).html(res);
  })
}