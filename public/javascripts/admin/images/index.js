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
  showOverlay();
  var folder = folderPath;
  var daterDate = $('#daterMonth').val() + '/' + $('#daterDay').val() + '/' + $('#daterYear').val();
  ajaxRequest(`${URL}/datePhotos`, {
    folderDirectory: folder,
    date: daterDate
  })
  .then(res => {
    setTimeout(function(){ hideOverlay(); }, 2000);
    console.log(res)
    if(res.err == 0){
      
    }
  })
}

function geotagPhotos(){
  var folder = folderPath;
  // var daterDate = $('#daterMonth').val() + '/' + $('#daterDay').val() + '/' + $('#daterYear').val();
  // var time = $('#geotaggerHour').val() + ':' + $('#geotaggerMinute').val() + ':' + $('#geotaggerSecond').val();
  // console.log(daterDate);
  var res = ajaxRequest(`${URL}/geotagPhotos`, {
    folderDirectory: folder,
    // date: daterDate
  })
  res.done((res) => {
    console.log(res)
  })
}