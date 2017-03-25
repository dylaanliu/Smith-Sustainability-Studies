// jQuery functions for admin home page
// TODO: check go-to specific study on manage studies works 
var controller = "server/admin-manage-studies-ctr.php";

// go to content div and shove some stuff in
$(document).ready(function() {
    
}); // end function

function setStudyStatus (status, checkStatus) {
    return (status == checkStatus) ? "checked" : ""
}

function loadAdminManageStudiesView(startStudyIDIn) {
    var startStudyID = startStudyIDIn || 1;

    var controllerData = { q: "getStudies" }
    var view = "views/admin-manage-studies-view.html";
    
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            $.getJSON(controller, controllerData, function(result) {
                //console.log(JSON.stringify(result));
                var studyArray = result.studies;
                var conditionGroupPhaseArray = result.conditionGroupPhase;

                // clear contents first
                document.getElementById("manageStudiesTable").innerHTML = "";
                if (!result.error) {
                    // html injection
                    $.each(studyArray, function(index, studyRecord) {
                        insertStr = 
                            "<form id='editStudyForm" + studyRecord.studyID + "' class='form-horizontal' role='form'>" +
                            "<div class='panel-heading'>" + 
                                "<div class='col-sm-12 panel-title'>" + 
                                    "<h4>Study " + studyRecord.studyID + ": " + studyRecord.title + "</h4>" + 
                                "</div>" + 
                                "<div class='form-group'>" +
                                    "<label for='description" + studyRecord.studyID + "' class='col-sm-2 control-label'>Study Summary:</label>" +
                                    "<div class='col-sm-9'>" +
                                        "<textarea class='form-control' id='description" + studyRecord.studyID + "' name='description" + studyRecord.studyID + "' rows='5'>" + studyRecord.description + "</textarea>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='form-group'>" +
                                    "<p class='col-sm-12' style='padding:3px'></p>" +
                                    "<label for='studyStatusSelector" + studyRecord.status + "' class='col-sm-2 control-label'><strong>Study Status: </strong></label>" +        
                                    "<div class='col-sm-2'>" +
                                        "<select class='form-control' id='studyStatusSelector" + studyRecord.studyID + "'  name='studyStatusSelector" + studyRecord.studyID + "' >" +
                                            "<option value='created'" + ((studyRecord.status == "created") ? "selected" : "") + ">created</option>" +
                                            "<option value='active'" + ((studyRecord.status == "active") ? "selected" : "") + ">active</option>" +
                                            "<option value='archived'" + ((studyRecord.status == "archived") ? "selected" : "") + ">archived</option>" +
                                        "</select>" +
                                    "</div>" +
                                    "<div class='col-sm-2 col-sm-offset-5'>" + 
                                        "<a data-toggle='collapse' href=#studyContent" + studyRecord.studyID + " name='collapse' class='btn btn-info btn-sm pull-right' id='" + studyRecord.studyID + "'>" +
                                            "More Details <span class='glyphicon glyphicon-chevron-right'></span>" + 
                                        "</a>" +
                                    "</div>" + 
                                "</div>" +
                            "</div>" + 
                            "<div id='studyContent" + studyRecord.studyID + "' class='collapse'>" + 
                                "<div class='container col-sm-offset-1 col-sm-10 panel-body  nice-blue-background'>" +                                   
                                    conditionGroupPhaseTabsEdit(studyRecord.studyID, conditionGroupPhaseArray) +
                                "</div>" +      
                            "</div>" +
                            "</form>";
                        $("#manageStudiesTable").append(insertStr);
                    }); // end each
                }
                else {
                    console.log(result.errorMsg);
                }
            });
        }
    });
} // end function


// ********************************************************************************
// ********************************************************************************
// This section to do with button management 
// ********************************************************************************
// ********************************************************************************
    
// TAB click event catcher to hightlight TAB
$("#viewGoesHere").on("click", "#manageStudiesTable ul.nav-tabs a", function(e) {
    e.preventDefault();
    $(this).tab('show');
});


// TAB remove click event catcher
//     try to delete the condition group on the server. If successful then deletes the
//     local condition group. Note, does not allow a user to delete the last group.
$("#viewGoesHere").on("click", "#manageStudiesTable ul.nav-tabs i[name^='removeTab']", function(e) {
console.log("Delete TAB");
    var removeTab = $(this).attr("name").split("_");
    var studyID = removeTab[1];
    var conditionGroup = removeTab[2];
 
    var checkstr =  confirm("are you sure you want to delete Condition Group " + conditionGroup + " from Study " + studyID + "?");
    if(checkstr == true){
     
        // make the DELETE request to the server. As per HTTP, delete resource should be passed in header
        $.ajax({
            url: controller + '?' + $.param({"deleteType": "conditionGroup",
                                             "studyID": studyID,
                                             "conditionGroup": conditionGroup
                                            }),
            type: 'DELETE',
            success: function(result, textStatus, xhr) {
                var data = jQuery.parseJSON(result);
                if (data.error)
                    alert(data.errorMsg);
                else {
                    // clear tabs and re-insert with new TAB
                    console.log ("TAB DELETED");
                    var conditionGroupPhaseArray = data.conditionGroupPhase;
                    $("#studyContent" + studyID + " div").empty();
                    $("#studyContent" + studyID + " div").append(conditionGroupPhaseTabsEdit(studyID, conditionGroupPhaseArray));                    
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


// TAB add click event catcher
//     add the group on the server and then insert the TAB into the DOM
$("#viewGoesHere").on("click", "#manageStudiesTable ul.nav-tabs a[name^='addTab']", function(e) {
console.log("Add TAB");
    var addTab = $(this).attr("name").split("_");
    var studyID = addTab[1];

    // form validates so do the POST
    $.ajax({
        url: controller,
        type: 'POST',
        data: {postType : "addTab",
               studyID : studyID
        },
        dataType: "json",        
        success: function (result, status) {            
            console.log('errorMsg='+result.errorMsg);
            // console.log(JSON.stringify(result));

            if (result.error)
                alert(result.errorMsg);
            else {
                // clear tabs and re-insert with new TAB
                console.log ("TAB ADDED");
                var conditionGroupPhaseArray = result.conditionGroupPhase;
                $("#studyContent" + studyID + " div").empty();
                $("#studyContent" + studyID + " div").append(conditionGroupPhaseTabsEdit(studyID, conditionGroupPhaseArray));
            }    
        }
    });

});


// "More Detail"/"Less Detail" click event catcher to toggle Button Name and chevron
$("#viewGoesHere").on("click", "#manageStudiesTable a[name='collapse']", function(e) {
console.log("More Detail Button");
    if ($(this).html() == 'More Details <span class="glyphicon glyphicon-chevron-right"></span>')
        $(this).html("Less Details <span class='glyphicon glyphicon-chevron-down'></span>");
    else 
        $(this).html("More Details <span class='glyphicon glyphicon-chevron-right'></span>");
});


// handles split sub-team button
$("#viewGoesHere").on("click", "#manageStudiesTable button[name^='splitSubTeamsStudy']", function(e) {
console.log("Split Sub Team Button");
    // find the studyID
    var splitArray = $(this).attr("name").split("_");
    var studyID = splitArray[1];

    // find the active condition group
    splitArray = $("#conditionTabHeaderMarker" + studyID + " li[class='active']").attr("id").split("_");
    var conditionGroup = splitArray[2];

    var dataArray = [];
    dataArray.push({name: 'putType', value: 'splitSubTeams'}); 
    dataArray.push({name: 'studyID', value: studyID });
    dataArray.push({name: 'conditionGroup', value: conditionGroup });

    // split the team in the current condition group
    $.ajax({
        url: controller,
        type: 'PUT',
        dataType: 'text',        
        contentType: "application/json; charset=utf-8",      // dont know if this is required
        data: JSON.stringify(dataArray),
        success: function (resultOut, status) {
            result = jQuery.parseJSON(resultOut);
            console.log('errorMsg='+result.errorMsg);
            // console.log(JSON.stringify(result));
            
            if (result.error)
                alert(result.errorMsg);
            else 
                alert("Sub-Teams created for Study: " + studyID + ", Conditon Group: " + conditionGroup);
        }
    });
});

        
// handles purge study button
$("#viewGoesHere").on("click", "#manageStudiesTable button[name^='purgeStudy']", function(e) {
console.log("Purge Study Button");

    // find the studyID
    var splitArray = $(this).attr("name").split("_");
    var studyID = splitArray[1];

    var dataObject = {  deleteType: "study", 
                        studyID: studyID
                     };
     
    var checkstr =  confirm('Are you sure you want to delete the study with studyID = ' + studyID + '? DELETE CANNOT BE UNDONE.');
    if(checkstr == true){

        // make the DELETE request to the server. As per HTTP, delete resource should be passed in header
        $.ajax({
            url: controller + '?' + $.param(dataObject),
            type: 'DELETE',
            success: function(result, textStatus, xhr) {
                var data = jQuery.parseJSON(result);
                console.log('errorMsg='+data.errorMsg);
                if (data.error)
                    alert(data.errorMsg);
                else {
                    // clean up view by removing all the elements of the study in the DOM.
                    // Force a refresh from the server to reflect new DOM
                    $("#editStudyForm" + studyID).remove();
                    location.reload();
                    alert("Delete successful. Study " + studyID + " deleted.");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');           
            }                         
        });
    } 
});

        
// handles save changes button
$("#viewGoesHere").on("click", "#manageStudiesTable button[name^='saveChanges']", function(e) {
console.log("Save Changes Button");

    // find the studyID
    var splitArray = $(this).attr("name").split("_");
    var studyID = splitArray[1];

    $("#editStudyForm" + studyID).validate({  
        rules:    { description: {maxlength:  100}},
        messages: { description: {maxlength: "maximum 100 characters" }},
        submitHandler: function (form) {

            // convert form data into javascript object and uniquify array names
            var dataArray = $(form).serializeArray();
            var indx = 0;
            var name;
            for (var i in dataArray) {
                if (dataArray[i].name.search(/\[/g) != -1) {
                    name = dataArray[i].name.replace(/\[.*?\]/g, "_" + indx++);
                    dataArray[i].name = name;
                }
            }
            dataArray.push({name: 'putType', value: 'studyForm'}); 
            dataArray.push({name: 'studyID', value: studyID });

            // update the study record using PUT
            $.ajax({
                url: controller,
                type: 'PUT',
                dataType: 'text',        
                contentType: "application/json; charset=utf-8",      // dont know if this is required
                data: JSON.stringify(dataArray),
                success: function (resultOut, status) {
                    result = jQuery.parseJSON(resultOut);
                    console.log('errorMsg='+result.errorMsg);
                    console.log(JSON.stringify(result));
                    
                    if (result.error)
                        alert(result.errorMsg);
                    else 
                        alert("Study: " + studyID + " updated.");
                }
            });
            return false; // ajax used, block the normal submit
        }
    }); 
     
    // add validation rules for Number of Entries, Posts, Likes Input boxes. Cannot used
    // typical rules above since the input elements are dynamically generated and the 
    // names are dependent on the number of condition groups and the number of phases in
    // the study.    
        $("#editStudyForm" + studyID + " input[name^='entriesNum_']").each(function() {
        $(this).rules('add', {
            required: true,
            digits: true,
            messages: {
                required: "Number required",
                digits: "Number required"
            }
        });
    });    
    $("#editStudyForm" + studyID + " input[name^='postsNum_']").each(function() {
        $(this).rules('add', {
            required: true,
            digits: true,
            messages: {
                required: "Number required",
                digits: "Number required"
            }
        });
    });   
    $("#editStudyForm" + studyID + " input[name^='likesNum_']").each(function() {
        $(this).rules('add', {
            required: true,
            digits: true,
            messages: {
                required: "Number required",
                digits: "Number required"
            }
        });
    });       
});



// ********************************************************************************
// ********************************************************************************
// This section to do with View Results 
// ********************************************************************************
// ********************************************************************************
        
function conditionGroupPhaseTabsEdit(studyID, conditionGroupPhaseArray) {
    var tabStr;
    
    // level 1
    tabStr = "<div class='tabbable boxed parentTabs'>";
            
    // condition tabs. Only add unique TABs
    tabStr += "<ul id='conditionTabHeaderMarker" + studyID + "' class='nav nav-tabs nav-justified'>";
    firstFound = false;
    foundTabs = [];                               // keeps track of the unique conditionGroup Numbers

    $.each(conditionGroupPhaseArray, function(index, cgR) {
        if (studyID != cgR.studyID)
            return true;            
        else if (foundTabs.indexOf(cgR.conditionGroupNum) == -1 && !firstFound) {
            tabStr += "<li class='active' id='removeTab_" + cgR.studyID + "_" + cgR.conditionGroupNum + "'>";
            tabStr +=     "<a href='#condition_" + cgR.studyID + "_" + cgR.conditionGroupNum + "'>Condition " + cgR.conditionGroupNum;
            tabStr +=     "<i name='removeTab_" + studyID + "_" + cgR.conditionGroupNum + "' class='glyphicon glyphicon-remove pull-right'></i></a></li>";
            firstFound = true;
            foundTabs.push(cgR.conditionGroupNum);
        }
        else if (foundTabs.indexOf(cgR.conditionGroupNum) == -1) {
            tabStr += "<li id='removeTab_" + cgR.studyID + "_" + cgR.conditionGroupNum + "'>";
            tabStr +=     "<a href='#condition_" + cgR.studyID + "_" + cgR.conditionGroupNum + "'>Condition " + cgR.conditionGroupNum;
            tabStr +=     "<i name='removeTab_" + studyID + "_" + cgR.conditionGroupNum + "' class='glyphicon glyphicon-remove pull-right'></i></a></li>";
            foundTabs.push(cgR.conditionGroupNum);
        }
    });
    // add TAB control
    tabStr += "<li><a name='addTab_" + studyID + "'><i class='glyphicon glyphicon-plus'></i></a></li>";              
    tabStr += "</ul>";
    
    // level 2
    tabStr += "<div id='condition-tab-content' class='tab-content'>";
    
    // contents of condition tabs (ie phase tabs)
    firstFoundCG = false;
    foundTabs = [];                               // keeps track of the unique conditionGroup Numbers
    $.each(conditionGroupPhaseArray, function(index, cgR) {
        // create a condition group tab or if the condition group is not part of the study, just skip to the
        // next condition group.
        if (studyID != cgR.studyID || foundTabs.indexOf(cgR.conditionGroupNum) != -1)
            return true;
        else if (!firstFoundCG) {
            tabStr += "<div class='tab-pane fade active in' id='condition_" + cgR.studyID + "_" +  cgR.conditionGroupNum + "'>";  
            firstFoundCG = true;
            foundTabs.push(cgR.conditionGroupNum);
        }
        else {
            tabStr += "<div class='tab-pane' id='condition_" + cgR.studyID + "_" +  cgR.conditionGroupNum + "'>";  
            foundTabs.push(cgR.conditionGroupNum);
        } 

        tabStr += "    <div class='tabbable'>";  
        tabStr += "        <ul  id='phaseTabHeaderMarker' class='nav nav-tabs nav-justified'>";  
        
        // only process the records that are from the study of interest and are from the current condition group, cgR  
        firstFoundPh = false;
        $.each(conditionGroupPhaseArray, function(index, phR) {
            if (studyID != phR.studyID || cgR.conditionGroupNum != phR.conditionGroupNum) 
                return true;
            else if (!firstFoundPh) {
                tabStr += "<li class='active'><a href='#study" + phR.studyID + "Condition" + cgR.conditionGroupNum + "Phase" + phR.phaseNum + "'>Phase " + phR.phaseNum + "</a></li>";  
                firstFoundPh = true;
            }
            else {
                tabStr += "<li><a href='#study" + phR.studyID + "Condition" + cgR.conditionGroupNum + "Phase" + phR.phaseNum + "'>Phase " + phR.phaseNum + "</a></li>";  
            }
        });
        tabStr += "        </ul>";
        tabStr += "        <div id='phase-tab-content' class='tab-content'>";  
             
        firstFoundPh = false;
        $.each(conditionGroupPhaseArray, function(index, phR) {
            if (studyID != phR.studyID || cgR.conditionGroupNum != phR.conditionGroupNum) 
                return true;
            else if (!firstFoundPh) {
                tabStr += "<div class='tab-pane fade active in' id='study" + phR.studyID + "Condition" + cgR.conditionGroupNum + "Phase" + phR.phaseNum + "'>";  
                tabStr += phaseCheckBoxesEdit(cgR.conditionGroupNum, phR.phaseNum, phR);
                tabStr += "</div>";
                firstFoundPh = true;
            }
            else {
                tabStr += "<div class='tab-pane' id='study" + phR.studyID + "Condition" + cgR.conditionGroupNum + "Phase" + phR.phaseNum + "'>";  
                tabStr += phaseCheckBoxesEdit(cgR.conditionGroupNum, phR.phaseNum, phR);
                tabStr += "</div>";
            }
        });

        tabStr += "        </div>";
        tabStr += "    </div>";
        tabStr += "</div>";

    });

    // close level 2
    tabStr += "</div>";

    // close level 1
    tabStr += "</div>";    
    
    tabStr += "<div class='form-group'>";
    tabStr +=     "<div class='col-sm-3'>";
    tabStr +=         "<button type='button' class='btn btn-primary btn-block' name='splitSubTeamsStudy_" + studyID + "' id='splitSubTeamsStudy_" + studyID + "'>Split into Sub-Teams</button>";
    tabStr +=     "</div>";
    tabStr +=     "<div class='col-sm-3'>";
    tabStr +=         "<button type='button' class='btn btn-primary btn-block' name='purgeStudy_" + studyID + "' id='purgeStudy_" + studyID + "'>Purge Study</button>";
    tabStr +=     "</div>";
    tabStr +=     "<div class='col-sm-3'>";
    tabStr +=         "<button type='submit' class='btn btn-primary btn-block' name='saveChanges_" + studyID + "' id='saveChanges_" + studyID + "'>Save Changes</button>";
    tabStr +=     "</div>";
    tabStr +=     "<div class='col-sm-3'>";
    tabStr +=         "<button type='reset' class='btn btn-danger btn-block' name='Reset'>Reset</button>";
    tabStr +=     "</div>";
    tabStr += "</div>";
    
    return tabStr;
}


// returns the indexed bit
function checkPermissionChecked(index, permissions) {
    return (permissions >> index & 1) ? "checked" : "";
}

function phaseCheckBoxesEdit (cg, ph, phR) {
    var phaseCheckBoxes = "";
    var permissions = phR.phasePermission;

    phaseCheckBoxes += "<div class='row'>";
    phaseCheckBoxes += "<div class='col-sm-4'>";
    phaseCheckBoxes += "    <strong>Basic</strong><br>";    
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='dataEntry' " + checkPermissionChecked(0, permissions) + ">";
    phaseCheckBoxes += "        <label for='dataEntry'>Data Entry</label><br>";
    phaseCheckBoxes += "    <strong>Statistics</strong><br>";    
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='personalStatistics' " + checkPermissionChecked(1, permissions) + ">";
    phaseCheckBoxes += "        <label for='personalStatistics'>Personal Statistics</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='conditionGroupStatistics' " + checkPermissionChecked(2, permissions) + ">";
    phaseCheckBoxes += "        <label for='conditionGroupStatistics'>Condition Group Statistics</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='subTeamStatistics' " + checkPermissionChecked(3, permissions) + ">";
    phaseCheckBoxes += "        <label for='subTeamStatistics'>Sub-team Statistics</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='shareToSocialMedia' " + checkPermissionChecked(4, permissions) + ">";
    phaseCheckBoxes += "        <label for='shareToSocialMedia'>Share to Social Media</label><br>";
    phaseCheckBoxes += "</div>";    
    
    phaseCheckBoxes += "<div class='col-sm-4'>";
    phaseCheckBoxes += "    <strong>Community Posts</strong><br>";    
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='submitTips' " + checkPermissionChecked(5, permissions) + ">";
    phaseCheckBoxes += "        <label for='submitTips'>Submit Tips</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='viewAdminTips' " + checkPermissionChecked(6, permissions) + ">";
    phaseCheckBoxes += "        <label for='viewAdminTips'>View Admin Tips</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='viewConditionGroupTips' " + checkPermissionChecked(7, permissions) + ">";
    phaseCheckBoxes += "        <label for='viewConditionGroupTips'>View Condition Group Tips</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='viewSubTeamTips' " + checkPermissionChecked(8, permissions) + ">";
    phaseCheckBoxes += "        <label for='viewSubTeamTips'>View Sub-team Tips</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='sharePostsToSocialMedia' " + checkPermissionChecked(9, permissions) + ">";
    phaseCheckBoxes += "        <label for='sharePostsToSocialMedia'>Share Posts to Social Media</label><br>";
    phaseCheckBoxes += "</div>";    
    
    phaseCheckBoxes += "<div class='col-sm-4'>";
    phaseCheckBoxes += "    <strong>Rewards</strong><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='private' " + checkPermissionChecked(10, permissions) + ">";
    phaseCheckBoxes += "        <label for='private'>Private</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='public' " + checkPermissionChecked(11, permissions) + ">";
    phaseCheckBoxes += "        <label for='public'>Public</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='progressionSystem' " + checkPermissionChecked(12, permissions) + ">";
    phaseCheckBoxes += "        <label for='progressionSystem'>Progression System</label><br>";
    phaseCheckBoxes += "</div>";    
    phaseCheckBoxes += "</div>";    
    phaseCheckBoxes += "<div class='row'>";
    phaseCheckBoxes += "    <p style='padding:6px;'></p>";
    phaseCheckBoxes += "    <div class='col-sm-12'>";
    phaseCheckBoxes += "        <strong>Number of :</strong><br>";
    phaseCheckBoxes += "    </div>";
    phaseCheckBoxes += "    <label for='entriesNum_" + cg + "_" + ph + "' class='col-sm-1 control-label'>Entires</label>";
    phaseCheckBoxes += "    <div class='col-sm-3'>";
    phaseCheckBoxes += "        <input type='text' class='form-control' id='entriesNum_" + cg + "_" + ph + "' name='entriesNum_" + cg + "_" + ph + "' value='" + phR.entriesNum + "'>";
    phaseCheckBoxes += "    </div>";
    phaseCheckBoxes += "    <label for='postsNum_" + cg + "_" + ph + "' class='col-sm-1 control-label'>Posts</label>";
    phaseCheckBoxes += "    <div class='col-sm-3'>";
    phaseCheckBoxes += "        <input type='text' class='form-control' id='postsNum_" + cg + "_" + ph + "' name='postsNum_" + cg + "_" + ph + "' value='" + phR.postsNum + "'>";
    phaseCheckBoxes += "    </div>";
    phaseCheckBoxes += "    <label for='likesNum_" + cg + "_" + ph + "' class='col-sm-1 control-label'>Likes</label>";
    phaseCheckBoxes += "    <div class='col-sm-3'>";
    phaseCheckBoxes += "        <input type='text' class='form-control' id='likesNum_" + cg + "_" + ph + "' name='likesNum_" + cg + "_" + ph + "' value='" + phR.likesNum + "'>";
    phaseCheckBoxes += "    </div>";
    phaseCheckBoxes += "    <p style='padding:6px;'></p>";
    phaseCheckBoxes += "</div>";    
    phaseCheckBoxes += "<p style='padding:6px;'></p>";

    return phaseCheckBoxes;
}

    
