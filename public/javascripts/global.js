const APP_URL = 'http://localhost:3000'

// function ajaxRequest(url, data) {
//   return $.ajax({
//     headers: {
//       'X-CSRF-Token': $('meta[name="csrf_token"]').attr('content')
//     },
//     url: url,
//     method: 'POST',
//     data: data
//   })
// }

function ajaxRequest(url, data) {
  // if (ajaxisRunning) {
  //   return;
  // }

  // ajaxisRunning = true;
  var res = $.ajax({
    type: 'POST',
    url: url,
    headers: {
      'X-CSRF-Token': $('meta[name="csrf_token"]').attr('content')
    },
    data: data,
    success: function() {
      ajaxisRunning = false;
    },
    error: function() {
      ajaxisRunning = false;
    }
  });

  return res;
}

function ajaxRequestForm(url, form) {
    return $.ajax({
        headers: {
            'X-CSRF-Token': $('meta[name="csrf_token"]').attr('content')
        },
        url: url,
        method: 'POST',
        data: new FormData(form[0]),
        contentType: false,
        cache: false,
        processData: false,
    })
}

function validatorMessages(validator, elem) {
  elem.html('')
  $.each(validator, (key, value) => {
    elem.append(value['message'] + '<br>')
  })
}

function clearHtmlElement(keyword) {
  $('[id^="' + keyword + '"]').each((index, elem) => {
    $(elem).val('')
  })
  $('[id="' + keyword + 'validator"]').html('')
}

function hideModal(modalId) {
  $(`#${modalId}`).modal('hide')
}

function showOverlay(){
  $('#overlay').attr('class', 'loading')
}

function hideOverlay(){
  $('#overlay').attr('class', '')
}
