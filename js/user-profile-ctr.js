function loadUserProfileView() {

    var controller = "server/user-profile-ctr.php"
    var controllerData = { q: "getUser"};
    var view = "views/user-profile-view.html";

    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            $.getJSON(controller, controllerData, function(profileString) {
                console.log(JSON.stringify(profileString));
            
                user = profileString.data[0];
                $('#profile-mid #userName').val(user.userName);
                $('#profile-mid #userName').attr("value", user.userName);
                $('#profile-mid #email').val(user.email);
                $('#profile-mid #email').attr("value", user.email);
            });
        } // end if
    });

// on the click of the save button, check the form and submit if it is OK    
    $("#viewGoesHere").on( "click", "#saveChanges", function(event) {
console.log("got here 1");
        $('#profile-form').validate({  // initialize plugin
            rules: {
                userName: {
                    required: true,
                    minlength:5
                },
                password: {
                    required: true,
                    minlength:8
                },
                confirm_password: {
                    equalTo: "#password"
                },
                email: {
                    email: true,
                    minlength:8
                }
            },
            messages: {
                userName: {
                    required: "Please enter a userName",
                    minlength: "minimum 5 characters"
                },
                password: {
                    required: "Please enter a password",
                    minlength: "minimum 8 characters"
                },
                password: {
                    equalTo: "Passwords do not match. Please retype."
                },
                email: {
                    required: "Expecting valid email (eg@gmail.com)"
                }
            },
            submitHandler: function (form) {
                
                // convert form data into javascript object
                var dataArray = $(form).serializeArray();
                var dataObject = {formName: 'profile-form'};
                for (var i in dataArray) {
                    dataObject[dataArray[i].name] = dataArray[i].value;
                }
                
                // update the user record using PUT
                 $.ajax({
                    url: controller,
                    type: 'PUT',
                    dataType: 'text',        
                    contentType: "application/json; charset=utf-8",      // dont know if this is required
                    data: dataObject,
                    success: function (resultOut, status) {
                        result = jQuery.parseJSON(resultOut);
                        
                        // update the defaults on the page if user uses the Reset button
                        $('#profile-mid #userName').attr("value", $('#profile-mid #userName').val());
                        $('#profile-mid #email').attr("value", $('#profile-mid #email').val());

                        if (result.error) {
                            alert("Error: " + result.errorMsg)
                        }
                        else {
                            alert("Success: " + result.errorMsg)                            
                        }
                        console.log('errorMsg='+result.errorMsg);
                        console.log(JSON.stringify(result));
                    }
                });
                return false; // ajax used, block the normal submit
            }
        });
    });
}