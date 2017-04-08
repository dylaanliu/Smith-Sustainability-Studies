$(document).ready(function() {
	
}); // end function

// go to content div and shove some stuff in
function loadUserContactView() {
	var view = "views/user-contact-view.html";
    $('.nav li').removeClass('active');
    $('#contact').addClass('active');

    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
/*        if(statusTxt == "success") {
            console.log("success");
        }*/
    });
}

$("#viewGoesHere").on( "click", "#send", function(event) {
	var name = $("#contact-name").val();
	var email = $("#contact-email").val();
	var subject = $("#subject").val();
	var message = $("#contact-message").val();
	var antiSpam = $("#anti-spam").val();

//console.log("outer email: "+email);
	if (name == "") {
		alert("Please fill in your name!");
		return false;
	} else if (email == "") {
		alert("Please fill in your email!");
		return false;
	} else if (subject == "") {
		alert("Please fill in your subject!");
		return false;
	} else if (message =="") {
		alert("Please fill in a message!");
		return false;
	}else {
		//console.log(" ajax email: "+email);
	    $.ajax({
	        url: "server/user-contact-ctr.php",
	        type: 'POST',
	        data: {name1: name, email1: email, subject1: subject, message1: message, antiSpam1: antiSpam},
	        dataType: 'text',
	        success: function (result, status) {
/*	            console.log('errorMsg='+result.errorMsg);
	            console.log(JSON.stringify(result));*/

	            if(result.error){
	                alert(result.errorMsg);
	            } else {
	                alert("Message Sent!");
	                // see if can do a soft refresh to get updated posts
	            }
	        }, 
	        error: function(jqXHR, exception){
/*	            console.log(jqXHR);
	            console.log(exception);*/
	            //console.log(xhr);
	            console.log("Something went wrong");
	        }
	    });
    return false; // ajax used, block the normal submit
	}
});