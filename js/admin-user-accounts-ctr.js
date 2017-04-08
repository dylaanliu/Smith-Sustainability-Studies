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

    $.each(result.users, function(key, user) {
        
        var actionStr =  
                    "<a href='#' class='btn btn-simple btn-warning  btn-icon edit' name='edit' id='" + user.userID + "'><i class='pe-7s-note pe-fw'></i></a>" +
                    "<a href='#' class='btn btn-simple btn-danger btn-icon remove' name='delete' id='" + user.userID + "'><i class='pe-7s-close pe-fw'></i></a>";
        if (result.privilegeLevel == 'super_admin' && user.privilegeLevel == 'admin')
            actionStr += 
                    "<a href='#' class='btn btn-info btn-icon btn-new' name='manageStudies' id='" + user.userID + "'><i class='pe-7s-plus'></i></a>";

        var rowStr = 
            "<tr><td>" + user.userID + "</td>" + 
                "<td>" + user.firstName + "</td>" + 
                "<td>" + user.lastName + "</td>" + 
                "<td>" + user.userName + "</td>" + 
                "<td>" + user.email + "</td>" + 
                "<td>" + user.privilegeLevel + "</td>" + 
                "<td>" + user.studyID + "</td>" + 
                "<td>" + user.currentConditionGroup + "</td>" + 
                "<td>" + user.currentPhase + "</td>" + 
                "<td>" + user.teamNum + "</td>" + 
                "<td>" + actionStr + "</td>" +
            "</tr>"
            
        $("#insertUserTable").append(rowStr);
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
           
           
            $.getJSON(adminUserAccountsController, controllerData, function(result) {
                /*console.log(JSON.stringify(result));*/
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
                    
                    // clear and hide modal
                    $('#newUserAccountModal').modal('hide');
                    $('#newUserAccountModal input').val('');

                    if (result.error) {
                        alert(result.errorMsg);
                    } 
                    else {
                        // find new record
                        var user = result.data[0];
         var actionStr =  
                    "<a href='#' class='btn btn-info btn-icon' name='edit' id='" + user.userID + "'><i class='pe-7s-note pe-fw'></i></a>" +
                    "<a href='#' class='btn btn-danger btn-icon' name='delete' id='" + user.userID + "'><i class='pe-7s-close pe-fw'></i></a>";
        if (result.privilegeLevel == 'super_admin' && user.privilegeLevel == 'admin')
            actionStr += 
                    "<a href='#' class='btn btn-info btn-icon btn-new' name='manageStudies' id='" + user.userID + "'><i class='pe-7s-plus'></i></a>";
/*        var actionStr =  
                    "<a href='#' class='btn btn-simple btn-warning btn-icon edit' name='edit' id='" + user.userID + "'><i class='pe-7s-note pe-fw'></i></a>" +
                    "<a href='#' class='btn btn-simple btn-danger btn-icon remove' name='delete' id='" + user.userID + "'><i class='pe-7s-close pe-fw'></i></a>";
 */                        
//                        var actionStr =  "<a href='#' name='edit' id='" + user.userID + "'><i class='pe-7s-note'></a>" +
//                                         "<a href='#' name='delete' id='" + user.userID + "'><i class='pe-7s-close'></a>";
//                        if (result.privilegeLevel == 'super_admin' && user.privilegeLevel == 'admin')
//                            actionStr += "<a href='#' class='btn btn-simple btn-danger btn-icon remove' name='manageStudies' id='" + user.userID + "'><i class='pe-7s-angle-right-circle pe-fw'></i></a>";

//                            "<a href='#' name='edit' id='" + user.userID + "'><span class='glyphicon glyphicon-edit'></span></a>" +
//                            "<a href='#' name='delete' id='" + user.userID + "'> <span class='glyphicon glyphicon-remove'></span></a>"
                        
                        $('#userAccountsTable').dataTable().fnAddData( [
                            user.userID, user.firstName, user.lastName, user.userName, user.email, user.privilegeLevel,
                            user.studyID, user.currentConditionGroup, user.currentPhase, user.teamNum, actionStr
                            
                        ]);
                    }
                }
            });
            return false; // ajax used, block the normal submit
        }
    });
}); 


function renderEditUserAcountSelectors(conditionGroupMax, currentConditionGroup, phaseMax, currentPhase) {
        
    // create current conditionGroup selector
    $('#editUserAccountModal #currentConditionGroupSelector').empty();
    var currentConditionGroupStartStr = "<option value='0' selected></option>";
    var currentConditionGroupStr = "";
    for (var i = 1; i <= conditionGroupMax; i++) {
        currentConditionGroupStr += "<option value = '" + i + "' ";
        if (i == currentConditionGroup) {
            currentConditionGroupStartStr = "<option value='0'></option>";
            currentConditionGroupStr += "selected";
        }
        currentConditionGroupStr += ">" + i + "</option>";
    }
    $('#editUserAccountModal #currentConditionGroupSelector').append(currentConditionGroupStartStr + currentConditionGroupStr);
    
    // create current phase selector
    $('#editUserAccountModal #currentPhaseSelector').empty();
    var currentPhaseStartStr = "<option value='0' selected></option>";
    var currentPhaseStr = "";
    for (var i = 1; i <= phaseMax; i++) {
        currentPhaseStr += "<option value = '" + i + "' ";
        if (i == currentPhase) {
            currentPhaseStartStr = "<option value='0'></option>";
            currentPhaseStr += "selected";
        }
        currentPhaseStr += ">" + i + "</option>";
    }
    $('#editUserAccountModal #currentPhaseSelector').append(currentPhaseStartStr + currentPhaseStr);
}


function renderEditUserAcountModal(privilegeLevel, users, studies, userStudies) {
    
        // fill in model with user info from the server
        user = users[0];    
        $('#editUserAccountModal #userName').val(user.userName);
        $('#editUserAccountModal #email').val(user.email);
        $('#editUserAccountModal #firstName').val(user.firstName);
        $('#editUserAccountModal #lastName').val(user.lastName);
        $('#editUserAccountModal #teamNum').val(user.teamNum);

        // set default max number of conditionGroup, phases.
        // TODO phase and condition group max numbers should be a global constant since it is used in several places in the 
        //      application
        var conditionGroupMax = 3;
        var phaseMax = 4;

        // create StudyID selector
        $('#editUserAccountModal #studyIDSelector').empty();
        var studyIDStartStr = "<option value='0' selected></option>";
        var studyIDStr = "";
        for (var i = 0; studies != null && i < studies.length; i++) {
            var study = studies[i];
            studyIDStr += "<option value = '" + study.studyID + "' ";
            if (study.studyID == user.studyID) {
                studyIDStartStr = "<option value='0'></option>";
                studyIDStr += "selected";
                conditionGroupMax = study.conditionGroups;
                phaseMax = study.phases;
            }
            studyIDStr += ">Study " + study.studyID + ": " + study.description + "</option>";
        }
        $('#editUserAccountModal #studyIDSelector').append(studyIDStartStr + studyIDStr);
        
        // create condition group and phase selectors
        renderEditUserAcountSelectors(conditionGroupMax, user.currentConditionGroup, phaseMax, user.currentPhase);
                
}

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
        
        // setup modal and show
        renderEditUserAcountModal(result.privilegeLevel, result.users, result.selectStudies, result.userStudies);        
        $('#editUserAccountModal').modal('show');
          
        // change detector used to detect changes in the studyID selector. When the selector is changed, 
        // update the condition group and phase selectors
        $('#editUserAccountModal').on('change','#studyIDSelector',function(){
            newStudyID = $(this).find("option:selected").attr('value');
            newStudy = null;
            
            // find study record
            for (var i = 0; result.selectStudies != null && i < result.selectStudies.length; i++) {
                if (newStudyID == result.selectStudies[i].studyID) 
                    newStudy = result.selectStudies[i];
            }
            
            // render new condition group and phase selectors
            if (newStudyID != 0 && newStudy != null)
                renderEditUserAcountSelectors(newStudy['conditionGroups'], 0, newStudy['phases'], 0)
        });
        
        // validate modal form, submit and update table  
        $('#editUserAccountModalForm').validate({  
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

                        // Just update table.
                        oTable = $('#userAccountsTable').dataTable();
                        oTable.fnUpdate($('#editUserAccountModal #firstName').val(), rowPos, 1, false);
                        oTable.fnUpdate($('#editUserAccountModalForm #lastName').val(), rowPos, 2, false);       
                        oTable.fnUpdate($('#editUserAccountModal #userName').val(), rowPos, 3, false);
                        oTable.fnUpdate($('#editUserAccountModal #email').val(), rowPos, 4, false);  
                        oTable.fnUpdate($('#editUserAccountModal #studyIDSelector').val(), rowPos, 6, false);
                        oTable.fnUpdate($('#editUserAccountModal #currentConditionGroupSelector').val(), rowPos, 7, false);
                        oTable.fnUpdate($('#editUserAccountModal #currentPhaseSelector').val(), rowPos, 8, false);      
                        oTable.fnUpdate($('#editUserAccountModal #teamNum').val(), rowPos, 9, true);

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

 
    var checkstr =  confirm('are you sure you want to delete this?');
    if(checkstr == true){
     
        // make the DELETE request to the server. As per HTTP, delete resource should be passed in header
        $.ajax({
            url: adminUserAccountsController + '?' + $.param({"userID": userID}),
            type: 'DELETE',
            row: row,
            success: function(result, textStatus, xhr) {
                var data = jQuery.parseJSON(result);
                /*console.log('errorMsg='+data.errorMsg);*/
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


function renderUserAccountManageStudiesSelectors(inStudiesList, allStudiesArray) {
    var outStudySelectorStr = "<option value='0' selected></option>";
    var inStudySelectorStr = "<option value='0' selected></option>";
    
    // create selectors
    $("#inStudySelector").empty();
    $("#outStudySelector").empty();    
    var firstInStudy = true;
    var firstOutStudy = true;
    allStudiesArray.forEach(function(study, studyIndex) {
        if ( inStudiesList.indexOf( study.studyID ) > -1  ) {
            if (firstInStudy) {
                firstInStudy = false;
                inStudySelectorStr += "<option selected value=" + study.studyID + ">StudyID " + study.studyID + ": " + study.description + "</option>";
            } else
                inStudySelectorStr += "<option value=" + study.studyID + ">StudyID " + study.studyID + ": " + study.description + "</option>";
        }
        else {
            if (firstOutStudy) {
                firstOutStudy = false;
                outStudySelectorStr += "<option selected value=" + study.studyID + ">StudyID " + study.studyID + ": " + study.description + "</option>";            
            } else
                outStudySelectorStr += "<option value=" + study.studyID + ">StudyID " + study.studyID + ": " + study.description + "</option>";            
        }
    });
    $("#inStudySelector").append(inStudySelectorStr);
    $("#outStudySelector").append(outStudySelectorStr);
}

// Click controller for manageStudies icon. 
// Used to add and remove admins from being an admin of a study. 
// Must start at #viewGoesHere since it is the only thing on the page before the 
// table is dynamically inserted.
$("#viewGoesHere").on( "click", "#userAccountsTable tbody tr td a[name='manageStudies']", function(e) {
    var userID = this.id;
 
    var controllerData = { q: "getUser", userID: userID };

    $.getJSON(adminUserAccountsController, controllerData, function(result) {
        
        // determine the list which contains the studies that the admin is already in.
        var inStudiesArray = result.userStudies;
        var allStudiesArray = result.selectStudies;
        var inStudiesList = [];
        inStudiesArray.forEach(function(study, studyIndex) {
            inStudiesList.push(study.studyID);
        });
        
        // setup modal and show
        renderUserAccountManageStudiesSelectors(inStudiesList, allStudiesArray);
        $('#manageStudiesUserAccountModal').modal('show');
        

        // Click controller for the remove/add study from inStudiesArray selector. 
        $("#viewGoesHere").on( "click", "#removeManageStudiesUserAccountButton, #addManageStudiesUserAccountButton", function() {
            var studyID;
            var action = "";

            // get the selector and action to be performed
            if ($(this).attr('name') == "removeManageStudiesUserAccountButton") {
                studyID = $( "#inStudySelector" ).val();
                action = "remove";
            }
            else {
                studyID = $( "#outStudySelector" ).val();
                action = "add";              
            }

            // update the adminStudiesTable using PUT
            var dataObject = {action: action, studyID: studyID, userID: userID, formName: 'manageStudiesUserAccountModalForm'};
            $.ajax({
                url: adminUserAccountsController,
                type: 'PUT',
                dataType: 'text',        
                contentType: "application/json; charset=utf-8",      // dont know if this is required
                data: dataObject,
                success: function (resultOut, status) {
                    result = jQuery.parseJSON(resultOut);
                    /*console.log('errorMsg=' + result.errorMsg);*/
                    
                    if (result.error) {
                        alert(result.errorMsg);
                    }
                    else {
                        // if server operations are successful, remove or add study into the inStudiesList and re-render the selectors
                        var index = inStudiesList.indexOf(studyID);
                        if (action == "remove" && index > -1) {
                            inStudiesList.splice(index, 1);
                        }
                        else if (action == "add" && index == -1) {
                            inStudiesList.push(studyID);
                        }
                        renderUserAccountManageStudiesSelectors(inStudiesList, allStudiesArray);                        
                    }
                }
            });
            return true;
        }); 
    }); 
}); 
