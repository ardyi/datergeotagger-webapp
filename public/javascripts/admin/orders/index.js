const URL = `${APP_URL}/admin/orders`

$(() => {
  $(document).on('click', ()=>{
    uploadFile()
  })

  fetchAllOrders();
})

function uploadFile(){
  ajaxRequestForm(`${URL}/uploadFile`, $('#UploadForm'))
  .then(res => {

  });
}

function fetchAllOrders(){
  ajaxRequest(`${URL}/fetchAllOrders`, {})
  .then(res => {
    $('#table-all-orders').html(res);
  })
}