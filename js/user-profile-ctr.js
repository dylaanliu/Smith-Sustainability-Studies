function loadUserProfileView() {

    var controller = "server/user-profile-ctr.php"
    var profileQuery = { q: "example"};
	var view = "views/user-profile-view.html";

	$("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
		if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            $.getJSON(controller, profileQuery, function(profileString) {
                console.log("in get");
                
				document.getElementById("username").value = profileString["User"][0]["userName"];
				console.log(profileString["User"][0]["userName"]);
				document.getElementById("email").value = profileString["User"][0]["email"];
				
            });
            console.log("out of get");
        } // end if
	});

	$("#profile-form").submit(function(event){
		var username = $("#username").val();
		var email = $("#email").val();
		var password = $("#password").val();

		event.preventDefault();

		$.ajax({
			url: 'server/user-profile-ctr.php',
			type: 'PUT',
			dataType: 'text',
			contentType: 'application/json; charset=utf-8',
			data: {userName1: userName, email1: email, password1: password},
			success: function(result) {
				console.log(result);
				console.log("updated!");
			},
			error: function(jqXHR, exception) {
				console.log(jqXHR);
				console.log(exception);
				console.log("Update went wrong");
			}
		}); // end ajax
	});
}