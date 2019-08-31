function onSignIn(googleUser) 
{
    var profile = googleUser.getBasicProfile();
    var res = ajaxRequest(APP_URL + '/login', {
        email: profile.getEmail(),
        first_name: profile.getGivenName(),
        last_name: profile.getFamilyName(),
        profile_picture: profile.getImageUrl()
	});
	res.done(function(res) {

        console.log(res);

        if (res['err'] == '1'){
            alert(res['msg']);
            signOut();
            window.location.href = "/signout";
        }else{
            sessionStorage.setItem("lastname", "Smith");
            var res = ajaxRequest(APP_URL + '/cae/createListValidLeads/' + res.enc_id.split('/').join('______'), {});
            res.done(function(){
                window.location.href = "/";
            });
        }
        console.log(sessionStorage.getItem("lastname"));
        // console.log(res.enc_id);
    });
    
}

function signOut() 
{
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
      //  window.location.href = "/login";
    });
}

function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}
