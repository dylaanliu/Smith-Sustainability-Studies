// jQuery functions for admin home page
// TODO: check go-to specific study on manage studies works 

// go to content div and shove some stuff in
$(document).ready(function() {
	
}); // end function

function loadAdminManageStudiesView() {

    var controller = "server/admin-manage-studies-ctr.php"
    var controllerData = { q: "getStudies" }
    var view = "views/admin-manage-studies-view.html";
    
	$("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            $.getJSON(controller, controllerData, function(result) {
                console.log(JSON.stringify(result));
                //alert(result);
                var studyArray = result.studies;
                var conditionGroupPhaseArray = result.conditionGroupPhase;

                // clear contents first
                document.getElementById("manageStudiesTable").innerHTML = "";
                if (!result.error) {
                    // html injection
                    $.each(studyArray, function(index, studyRecord) {
                        $("#manageStudiesTable").append("<form id='editStudyForm" + studyRecord.studyID + "' class='form-horizontal' role='form'>");
                        $("#manageStudiesTable").append(
                            "<div class='panel-heading'>" + 
                                "<div class='col-sm-12 panel-title'>" + 
                                    "<h4>Study " + studyRecord.studyID + ": " + studyRecord.title + "</h4>" + 
                                "</div>" + 
                                "<div class='form-group'>" +
                                    "<label for='description" + studyRecord.studyID + "' class='col-sm-2 control-label'>Study Summary:</label>" +
                                    "<div class='col-sm-9'>" +
                                        "<textarea class='form-control' id='description" + studyRecord.studyID + "' name='description" + studyRecord.studyID + "' rows='5' value='" + studyRecord.studyID + "'></textarea>" +
                                    "</div>" +
                                "</div>" +
                                "<br>" +
                                "<div class='form-group'>" +
                                    "<label for='studyStatusSelector" + studyRecord.status + "' class='col-sm-2 control-label'><strong>Study Status: </strong></label>" +        
                                    "<div class='col-sm-2'>" +
                                        "<select class='form-control' id='studyStatusSelector" + studyRecord.status + "'  name='studyStatusSelector" + studyRecord.status + "' >" +
                                            "<option value='created' selected>created</option>" +
                                            "<option value='active'>active</option>" +
                                            "<option value='archived'>archived</option>" +
                                        "</select>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='col-sm-2 col-sm-offset-5'>" + 
                                    "<a data-toggle='collapse' href=#studyContent" + studyRecord.studyID + " name='collapse' class='btn btn-info btn-sm pull-right' id='" + studyRecord.studyID + "'>" +
                                        "More Details <span class='glyphicon glyphicon-chevron-right'></span>" + 
                                    "</a>" +
                                "</div>" + 
                            "</div>"); 
                        $("#manageStudiesTable").append(
                            "<div id='studyContent" + studyRecord.studyID + "' class='collapse'>" + 
                                "<div class='container col-sm-offset-1 col-sm-10 panel-body'>" +                                   
                                    conditionGroupPhaseTabsEdit(studyRecord.studyID, conditionGroupPhaseArray) +
                                "</div>" + 
                                "<div class='form-group'>" +
                                    "<div class='col-sm-2'>" +
                                        "<button type='button' class='btn btn-primary btn-block' name='purgeStudy" + studyRecord.studyID + "' id='purgeStudy" + studyRecord.studyID + "'>Purge Study</button>" +
                                    "</div>" +
                                    "<div class='col-sm-offset-1 col-sm-2'>" +
                                        "<button type='submit' class='btn btn-primary btn-block' name='saveChanges" + studyRecord.studyID + "' id='saveChanges" + studyRecord.studyID + "'>Save Changes</button>" +
                                    "</div>" +
                                    "<div class='col-sm-offset-1 col-sm-2'>" +
                                        "<button type='button' class='btn btn-primary btn-block' name='splitSubTeamsStudy" + studyRecord.studyID + "' id='splitSubTeamsStudy" + studyRecord.studyID + "'>Split into Sub-Teams</button>" +
                                    "</div>" +
                                    "<div class='col-sm-offset-1 col-sm-2'>" +
                                        "<button type='reset' class='btn btn-danger btn-block' name='Reset'>Reset</button>" +
                                    "</div>" +
                                "</div>" +      
                            "</div>"); 
                        $("#manageStudiesTable").append("</form>");
                    }); // end each
                }
                else {
                    console.log(result.errorMsg);
                }
            });
        }
	});
} // end function


// TAB click event catcher
$("#viewGoesHere").on("click", "#manageStudiesTable ul.nav-tabs a", function(e) {
    e.preventDefault();
    $(this).tab('show');
});


// More/Less detail click event catcher to toggle message and chevron
$("#viewGoesHere").on("click", "#manageStudiesTable a[name='collapse']", function(e) {
console.log("More Detail Button");
console.log($(this).html());
    if ($(this).html() == 'More Details <span class="glyphicon glyphicon-chevron-right"></span>')
        $(this).html("Less Details <span class='glyphicon glyphicon-chevron-down'></span>");
    else 
        $(this).html("More Details <span class='glyphicon glyphicon-chevron-right'></span>");
});

	
function conditionGroupPhaseTabsEdit(studyID, conditionGroupPhaseArray) {
    var tabStr;
    
    // level 1
    tabStr = "<div class='tabbable boxed parentTabs'>";
            
    // condition tabs. Only add unique TABs
    tabStr += "<ul class='nav nav-tabs nav-justified'>";
    firstFound = false;
    foundTabs = [];                               // keeps track of the unique conditionGroup Numbers

    $.each(conditionGroupPhaseArray, function(index, cgR) {
        if (studyID != cgR.studyID)
            return true;            
        else if (foundTabs.indexOf(cgR.conditionGroupNum) == -1 && !firstFound) {
            tabStr += "<li class='active'><a href='#condition_" + cgR.studyID + "_" + cgR.conditionGroupNum + "'>Condition " + cgR.conditionGroupNum + "</a></li>";
            firstFound = true;
            foundTabs.push(cgR.conditionGroupNum);
        }
        else if (foundTabs.indexOf(cgR.conditionGroupNum) == -1) {
            tabStr += "<li><a href='#condition_" + cgR.studyID + "_" + cgR.conditionGroupNum + "'>Condition " + cgR.conditionGroupNum + "</a></li>";              
            foundTabs.push(cgR.conditionGroupNum);
        }
    });
    tabStr += "</ul>";
    
    // level 2
    tabStr += "<div class='tab-content'>";
    
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
        tabStr += "        <ul class='nav nav-tabs nav-justified'>";  
        
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
        tabStr += "        <div class='tab-content'>";  
             
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
    phaseCheckBoxes += "    <label for='entriesNum_" + cg + "_" + ph + "' class='col-sm-1 control-label'>Entries</label>";
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

	
