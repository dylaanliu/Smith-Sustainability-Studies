/* File : index-home.js
   Description : handles client side login validation communication with server. If successful, redirects to admin-home.html 
       or user-home.html as indicated by the server.
*/

// removed content here
$(document).ready(function(){
});

$("#loginForm").submit(function( event ) {
    var username = $("#username").val();
    var password = $("#password").val();

    // Stop form from submitting normally
    event.preventDefault();

    //Checking for blank fields.
    if( username =='' || password ==''){
        $('input[type="text"],input[type="password"]').css("border","2px solid red");
        $('input[type="text"],input[type="password"]').css("box-shadow","0 0 3px red");
        alert("Please fill all fields...!!!!!!");
    } 
    else {
        // pass input credentials to server and wait for server to respond. If successful, redirect; otherwise
        // indicate error.
        $.post("server/verifyUser.php",{ username1: username, password1:password}, "json")
        .done(function(response) {
            data = jQuery.parseJSON(response);
            localStorage.setItem("userID", "3");
            localStorage.setItem("CurrentConditionGroup", "1");
            localStorage.setItem("currentPhase", "2");
            localStorage.setItem("studyID", "1");

            // console.log('errorMsg='+data.errorMsg);
            
            // only redirect if there is not and error and if redirect is defined
            if (data.error === undefined || data.error || (!data.error && data.redirect === undefined)) {
                $('input[type="text"],input[type="password"]').css({"border":"2px solid red","box-shadow":"0 0 3px red"});
                alert(data.errorMsg);
            } 
            else {
                console.log('got to successful login!!');
                window.location.href = location.origin + data.redirect;
            }                        
        });
    }
});

