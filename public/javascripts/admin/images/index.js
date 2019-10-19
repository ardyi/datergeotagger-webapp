const URL = `${APP_URL}/admin/images`

var propertyLocation;

$(document).on('click', '#btn-dater', ()=>{
  datePhotos();
})

$(document).on('click', '#btn-geotagger', ()=>{
  geotagPhotos();
})

$(document).on('blur', '#geotaggerLocatoin', () => {
  propertyLocation = $('#geotaggerLocatoin').val();
})

function datePhotos(){
  showOverlay();
  var folder = $('#folderPath').val();
  var daterDate = $('#daterMonth').val() + '/' + $('#daterDay').val() + '/' + $('#daterYear').val();
  var res = ajaxRequest(`${URL}/datePhotos`, {
    folderDirectory: folder,
    date: daterDate
  })
  res.done((res) => {
    console.log(res.length)

    console.log(res != null ? 'Dated photos!' : 'no photos')
    hideOverlay();
  })
  // .then(res => {
  //   // setTimeout(function(){ hideOverlay(); }, 2000);
  //   console.log(res)
  //   // if(res.err == 0){
      
  //   // }
  // })
}

function geotagPhotos(){
  showOverlay();
  var folder = $('#folderPath').val();
  var daterDate =  $('#daterYear').val() + ':' + $('#daterMonth').val() + ':' + $('#daterDay').val();
  var time = $('#geotaggerHour').val() + ':' + $('#geotaggerMinute').val() + ':' + $('#geotaggerSecond').val();
  // console.log(daterDate);
  var res = ajaxRequest(`${URL}/geotagPhotos`, {
    folderDirectory: folder,
    propertyLocation: $('#geotaggerLocatoin').val(),
    geoDate: daterDate,
    geoTime: time
  })
  res.done((res) => {
    hideOverlay();
    console.log(res)
  })
}