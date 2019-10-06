const URL = `${APP_URL}/admin/images`

var folderPath;
var propertyLocation;

$(document).on('click', '#btn-dater', ()=>{
  datePhotos();
})

$(document).on('click', '#btn-geotagger', ()=>{
  geotagPhotos();
})

$(document).on('blur', '#folderPath', () => {
  folderPath = $('#folderPath').val();
})

$(document).on('blur', '#geotaggerLocatoin', () => {
  propertyLocation = $('#geotaggerLocatoin').val();
})

function datePhotos(){
  var folder = folderPath;
  var daterDate = $('#daterMonth').val() + '/' + $('#daterDay').val() + '/' + $('#daterYear').val();
  ajaxRequest(`${URL}/datePhotos`, {
    folderDirectory: folder,
    date: daterDate
  })
  .then(res => {
    console.log(res);
  })
}

function geotagPhotos(){
  var folder = folderPath;
  var daterDate = $('#daterMonth').val() + '/' + $('#daterDay').val() + '/' + $('#daterYear').val();
  var time = $('#geotaggerHour').val() + ':' + $('#geotaggerMinute').val() + ':' + $('#geotaggerSecond').val();
  // console.log(daterDate);
  ajaxRequest(`${URL}/geotagPhotos`, {
    folderDirectory: folder,
    date: daterDate
  })
  .then(res => {
    console.log(res);
  })
}