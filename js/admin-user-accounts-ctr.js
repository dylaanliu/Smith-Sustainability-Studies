// jQuery functions for admin user acount pages
// TODO: check go-to specific study on manage studies works 
// ********************************
// NOTE: DO NOT HAVE ANDYTHING IN $(document).ready(function() since this controls a 
//    dynamically loaded VIEW. Use only for testing
// ********************************

// go to content div and shove some stuff in

var userAccountsTable;
var adminUserAccountsController = "server/admin-user-accounts-ctr.php";

// should not be using globals 
var adminUserAccountsControllerEditRowPos;
var adminUserAccountsControllerEditUserID;

$(document).ready(function() {
    
});


function renderUserAccountTable(result){
    document.getElementById("insertUserTable").innerHTML = "";

    $.each(result.data, function(key, user) {
        $("#insertUserTable").append(
        "<tr><td>" + user.userID + "</td>" + 
            "<td>" + user.firstName + "</td>" + 
            "<td>" + user.lastName + "</td>" + 
            "<td>" + user.userName + "</td>" + 
            "<td>" + user.email + "</td>" + 
            "<td>" + user.studyID + "</td>" + 
            "<td>" + user.currentConditionGroup + "</td>" + 
            "<td>" + user.currentPhase + "</td>" + 
            "<td>" + user.teamNum + "</td>" + 
            "<td>" + 
                "<a href='#' class='btn btn-simple btn-warning btn-icon edit' name='edit' id='" + user.userID + "'><i class='pe-7s-note'></i></a>" +
                "<a href='#' class='btn btn-simple btn-danger btn-icon remove' name='delete' id='" + user.userID + "'><i class='pe-7s-close'></i></a>"+
            "</td>" +
        "</tr>"
        );
    });
    
    // no sorting on columns with class="Action"
    userAccountsTable = $("#userAccountsTable").dataTable({
        "pagingType": "full_numbers",
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        responsive: true,
        "aoColumnDefs" : [
            {'bSortable' : false, 'aTargets' : [ 'Action']}
        ]
    }); 
}

function loadAdminUserAccountsView(createUserIn) {
    var createUser = createUserIn || false;
    var view = "views/admin-user-accounts-view.html";
    var controllerData = { q: "getAllUsers", userID: "" };

    //make link on nav active
    $('.nav li').removeClass('active');
    $('#loadAdminUserAccounts').addClass('active');

    // clear contents first
    document.getElementById("viewGoesHere").innerHTML = "";

    // go to server and load in view for this portion of the page
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){

        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
           
            console.log("hello");
            $.getJSON(adminUserAccountsController, controllerData, function(result) {
                console.log(JSON.stringify(result));
                renderUserAccountTable(result);
                if (createUser)
                    $("#create-new-account").trigger( "click" );
            });
        };        
        
    });    
}


// Click controller for the CreateNewAccount button.
// Clicking button will pop up modal for registration info to be entered. Validate input.
$("#viewGoesHere").on( "click", "#create-new-account", function() {
    console.log('got to model, create-new-account modal'); 
    $('#newUserAccountModal').modal('show');
      
    $('#newUserAccountModalForm').validate({  // initialize plugin
        rules: {
            userName: {
                required: true,
                minlength:5
            },
            password: {
                required: true,
                minlength:8
            },
            email: {
                email: true,
                minlength:8
            },
        },
        messages: {
            userName: {
                required: "Please enter a userName",
                minlength: "minimum 8 characters"
            },
            password: {
                required: "Please enter a password",
                minlength: "minimum 8 characters"
            },
            email: {
                required: "Expecting valid email (eg@gmail.com)"
            }
        },
        submitHandler: function (form) {
            
            var data = $(form).serializeArray();
            data.push({formName: 'newUserAccountModalForm'});
            
            // form validates so do the POST
            $.ajax({
                url: adminUserAccountsController,
                type: 'POST',
                data: $(form).serialize(),
                dataType: "json",        
                success: function (result, status) {
                    
                    console.log('errorMsg='+result.errorMsg);
                    console.log(JSON.stringify(result));

                    // clear and hide modal
                    $('#newUserAccountModal').modal('hide');
                    $('#newUserAccountModal input').val('');

                    if (result.error) {
                        alert(result.errorMsg);
                    } 
                    else {
                        // find new record
                        var user = result.data[0];
                        $('#userAccountsTable').dataTable().fnAddData( [
                            user.userID, user.firstName, user.lastName, user.userName, user.email,
                            user.studyID, user.currentConditionGroup, user.currentPhase, user.teamNum,
                            "<a href='#' name='edit' id='" + user.userID + "'><span class='glyphicon glyphicon-edit'></span></a>" +
                            "<a href='#' name='delete' id='" + user.userID + "'> <span class='glyphicon glyphicon-remove'></span></a>"
                        ]);
                    }
                }
            });
            return false; // ajax used, block the normal submit
        }
    });
}); 


// Click controller for edit icon. 
// Used to edit a row in the datatable. 
// Must start at #viewGoesHere since it is the only thing on the page before the 
// table is dynamically inserted.
// Click will pop up a modal for editing fields. 
// NOTE: need to pass the row to insert to the callback so create new closure
//       using createCallback function
$("#viewGoesHere").on( "click", "#userAccountsTable tbody tr td a[name='edit']", function(event) {
    var userID = this.id;
    var controllerData = { q: "getUser", userID: userID };
    var row = $(this).closest("tr").get(0);
    var rowPos = $('#userAccountsTable').dataTable().fnGetPosition(row);
    adminUserAccountsControllerEditRowPos = rowPos;
    adminUserAccountsControllerEditUserID = userID;

   $.getJSON(adminUserAccountsController, controllerData, function(result) {
        // console.log(JSON.stringify(result));
        console.log('got to model, edit-user-account modal'); 
        
        user = result.data[0];    
        $('#editUserAccountModal #userName').val(user.userName);
        $('#editUserAccountModal #email').val(user.email);
        $('#editUserAccountModal #firstName').val(user.firstName);
        $('#editUserAccountModal #lastName').val(user.lastName);
        $('#editUserAccountModal #studyID').val(user.studyID);
        $('#editUserAccountModal #currentConditionGroup').val(user.currentConditionGroup);
        $('#editUserAccountModal #currentPhase').val(user.currentPhase);
        $('#editUserAccountModal #teamNum').val(user.teamNum);
        $('#editUserAccountModal').modal('show');
          
        $('#editUserAccountModalForm').validate({  // initialize plugin
            rules: {
                userName: {
                    required: true,
                    minlength:5
                },
                email: {
                    email: true,
                    minlength:8
                },
                teamNum: {
                    number: true
                }
            },
            messages: {
                userName: {
                    required: "Please enter a userName",
                    minlength: "minimum 5 characters"
                },
                email: {
                    required: "Expecting valid email (eg@gmail.com)"
                },
                teamNum: {
                    number: "Expecting number"
                }
            },
            submitHandler: function (form) {
                
                // convert form data into javascript object
                var dataArray = $(form).serializeArray();
                var dataObject = {userID: adminUserAccountsControllerEditUserID, formName: 'editUserAccountModalForm'};
                for (var i in dataArray) {
                    dataObject[dataArray[i].name] = dataArray[i].value;
                }
                
                // update the user record using PUT
                 $.ajax({
                    url: adminUserAccountsController,
                    type: 'PUT',
                    dataType: 'text',        
                    contentType: "application/json; charset=utf-8",      // dont know if this is required
                    data: dataObject,
                    success: function (resultOut, status) {
                        result = jQuery.parseJSON(resultOut);
                        rowPos = adminUserAccountsControllerEditRowPos;
                        console.log('errorMsg='+result.errorMsg);
                        console.log(JSON.stringify(result));

                        // Just update table.
                        oTable = $('#userAccountsTable').dataTable();
                        oTable.fnUpdate($('#editUserAccountModal #firstName').val(), rowPos, 1, false);
                        oTable.fnUpdate($('#editUserAccountModalForm #lastName').val(), rowPos, 2, false);       
                        oTable.fnUpdate($('#editUserAccountModal #userName').val(), rowPos, 3, false);
                        oTable.fnUpdate($('#editUserAccountModal #email').val(), rowPos, 4, false);  
                        oTable.fnUpdate($('#editUserAccountModal #studyID').val(), rowPos, 5);
                        oTable.fnUpdate($('#editUserAccountModal #currentConditionGroup').val(), rowPos, 6, false);
                        oTable.fnUpdate($('#editUserAccountModal #currentPhase').val(), rowPos, 7, false);      
                        oTable.fnUpdate($('#editUserAccountModal #teamNum').val(), rowPos, 8, false);
                        //oTable.row(rowPos).scrollTo();
                         // clear and hide modal
                        $('#editUserAccountModal').modal('hide');
                        $('#editUserAccountModal input').val('');
                    }
                });
                return false; // ajax used, block the normal submit
            }
        }); 
    }); 
}); 


// Click controller for delete icon. 
// Used to delete a row in the datatable. 
// Must start at #viewGoesHere since it is the only thing on the page before the 
// table is dynamically inserted.
$("#viewGoesHere").on( "click", "#userAccountsTable tbody tr td a[name='delete']", function(e) {
    var userID = this.id;
    var row = $(this).closest("tr").get(0);
    var oTable;
    console.log('got here ' + userID);
 
    var checkstr =  confirm('are you sure you want to delete this?');
    if(checkstr == true){
     
        // make the DELETE request to the server. As per HTTP, delete resource should be passed in header
        $.ajax({
            url: adminUserAccountsController + '?' + $.param({"userID": userID}),
            type: 'DELETE',
            row: row,
            success: function(result, textStatus, xhr) {
                var data = jQuery.parseJSON(result);
                console.log('errorMsg='+data.errorMsg);
                if (data.error)
                    alert(data.errorMsg);
                else {
                    var oTable = $('#userAccountsTable').dataTable(); 
                    oTable.fnDeleteRow(oTable.fnGetPosition(this.row));                
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');           
            }                         
        });
        return true;
    } 
    else {
        return false;
    }
});

