/* File : index.js
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
        $.post("server/index.php",{ username1: username, password1:password}, "json")
        .done(function(response) {
            data = jQuery.parseJSON(response);
/*            console.log('errorMsg='+data.errorMsg);
            console.log('userName='+data.userName);*/
            
            // only redirect if there is not and error and if redirect is defined
            if (data.error === undefined || data.error || (!data.error && data.redirect === undefined)) {
                $('input[type="text"],input[type="password"]').css({"border":"2px solid red","box-shadow":"0 0 3px red"});
                alert(data.errorMsg);
            } 
            else {
               // console.log('got to successful login!!');
                
                // store user information for use by views
                localStorage.setItem("userID", data.userID);
                localStorage.setItem("CurrentConditionGroup", data.currentConditionGroup);
                localStorage.setItem("currentPhase", data.currentPhase);
                localStorage.setItem("studyID", data.studyID);
                localStorage.setItem("teamNumber", data.teamNum);
             // console.log(JSON.stringify(data));  
                var userID = localStorage.getItem("userID");
                var currentConditionGroup = localStorage.getItem("CurrentConditionGroup");
                var currentPhase = localStorage.getItem("currentPhase");
                var studyID = localStorage.getItem("studyID");
                var teamNumber = localStorage.getItem("teamNumber");

               // console.log("user ID: "+userID + " condition group: "+currentConditionGroup+" phase: "+currentPhase +" study: "+studyID+" teamNumber: "+teamNumber);
                //alert("index.js user team: "+ teamNumber);
                window.location.href = location.origin + data.redirect;
            }                        
        });
    }
});

