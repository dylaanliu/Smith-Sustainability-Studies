// jQuery functions for admin create study page
// ********************************
// NOTE: DO NOT HAVE ANDYTHING IN $(document).ready(function() since this controls a 
//    dynamically loaded VIEW. Use only for testing
// ********************************

// go to content div and shove some stuff in

var adminCreateStudyController = "server/admin-create-study-ctr.php";
    
$(document).ready(function() {
    
});


function loadAdminCreateStudyView() {
    var view = "views/admin-create-study-view.html";
    var controllerData = { };

    //make link on nav active
    $('.nav li').removeClass('active');
    $('#loadAdminCreateStudy').addClass('active');

    // clear contents first
    document.getElementById("viewGoesHere").innerHTML = "";

    // go to server and load in view for this portion of the page
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){

        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {

            // insert condition/phase TABs
            document.getElementById("tabsGoesHere").innerHTML = "";
            $("#tabsGoesHere").append(conditionGroupPhaseTabs(2, 3));
        };        
    });    
}


// Click controller for the CreateNewAccount button.
// Clicking button will pop up modal for registration info to be entered. Validate input.
$("#viewGoesHere").on( "click", "#createStudy", function() { 

    $('#createStudyForm').validate({  
        rules: {
            title: {
                required: true,
                minlength:5,
                maxlength:50
            },
            description: {
                maxlength:1000
            }

        },
        messages: {
            title: {
                required: "Please enter a Study Title",
                minlength: "minimum 5 characters",
                maxlength: "maximum 50 characters"
            },
            description: {
                maxlength: "maximum 1000 characters"
            }
        },
        submitHandler: function (form) {
            
            var data = $(form).serializeArray();
            data.push({formName: 'createStudyForm'});
            
            // form validates so do the POST
            $.ajax({
                url: adminCreateStudyController,
                type: 'POST',
                data: $(form).serialize(),
                dataType: "json",        
                success: function (result, status) {
                    alert(result.errorMsg);
                }
            });
            return false; // ajax used, block the normal submit
        }
    });
}); 


// TAB click event catcher
$("#viewGoesHere").on("click", "#tabsGoesHere ul.nav-tabs a", function(e) {
    e.preventDefault();
    $(this).tab('show');
});


// selector change event catcher. When change detected, redraw based on condition group and phase selector values
$("#viewGoesHere").on("change", "#conditionGroupSelector, #phaseSelector", function(e) {
    var numConditionGroups = $("#conditionGroupSelector").val();
    var numPhases = $("#phaseSelector").val();
    
    document.getElementById("tabsGoesHere").innerHTML = "";
    $("#tabsGoesHere").append(conditionGroupPhaseTabs(numConditionGroups, numPhases));    
});


function conditionGroupPhaseTabs(numConditionGroups, numPhases) {
    var tabStr;
    
    // level 1
    tabStr = "<div class='tabbable boxed parentTabs' id='tabbable'>";
            
    // condition tabs
    tabStr += "<ul class='nav nav-tabs nav-justified'>";
    for (i = 1; i <= numConditionGroups; i++ ) {
        if (i == 1)
            tabStr += "<li class='active'><a href='#condition" + i + "'>Condition " + i + "</a></li>";  
        else
            tabStr += "<li><a href='#condition" + i + "'>Condition " + i + "</a></li>";  
    }
    tabStr += "</ul>";
    
    // level 2
    tabStr += "<div class='tab-content'>";
    
    // contents of condition tabs (ie phase tabs)
     for (cg = 1; cg <= numConditionGroups; cg++ ) {
        if (cg == 1)
            tabStr += "<div class='tab-pane fade active in' id='condition" + cg + "'>";  
        else
            tabStr += "<div class='tab-pane' id='condition" + cg + "'>";  
        tabStr += "    <div class='tabbable'>";  
        tabStr += "        <ul class='nav nav-tabs nav-justified'>";  
        for (ph = 1; ph <= numPhases; ph++ ) {
            if (ph == 1)
                tabStr += "<li class='active'><a href='#condition" + cg + "Phase" + ph + "'>Phase " + ph + "</a></li>";  
            else
                tabStr += "<li><a href='#condition" + cg + "Phase" + ph + "'>Phase " + ph + "</a></li>";  
        }
        tabStr += "        </ul>";
        tabStr += "        <div class='tab-content'>";  
        for (ph = 1; ph <= numPhases; ph++ ) {
            if (ph == 1)
                tabStr += "<div class='tab-pane fade active in' id='condition" + cg + "Phase" + ph + "'>";  
            else
                tabStr += "<div class='tab-pane' id='condition" + cg + "Phase" + ph + "'>";  
//            tabStr += "<p>Condition " + cg + "Phase " + ph + "</p>";
            tabStr += phaseCheckBoxes(cg, ph);
            tabStr += "</div>";
        }        
        tabStr += "        </div>";
        tabStr += "    </div>";
        tabStr += "</div>";
    } 

    // close level 2
    tabStr += "</div>";

    // close level 1
    tabStr += "</div>";    

    return tabStr;
}


function phaseCheckBoxes (cg, ph) {
    var phaseCheckBoxes = "";

    phaseCheckBoxes += "<div class='row'>";
    phaseCheckBoxes += "<div class='col-sm-4'>";
    phaseCheckBoxes += "    <br><strong>Basic</strong><br><br>";    
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='dataEntry' checked>";
    phaseCheckBoxes += "        <label for='dataEntry'>Data Entry</label><br>";
    phaseCheckBoxes += "    <br><strong>Statistics</strong><br><br>";    
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='personalStatistics'>";
    phaseCheckBoxes += "        <label for='personalStatistics'>Personal Statistics</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='conditionGroupStatistics'>";
    phaseCheckBoxes += "        <label for='conditionGroupStatistics'>Condition Group Statistics</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='subTeamStatistics'>";
    phaseCheckBoxes += "        <label for='subTeamStatistics'>Sub-team Statistics</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='shareToSocialMedia' disabled>";
    phaseCheckBoxes += "        <label for='shareToSocialMedia'>Share to Social Media</label><br>";
    phaseCheckBoxes += "</div>";    
    
    phaseCheckBoxes += "<div class='col-sm-4'>";
    phaseCheckBoxes += "    <br><strong>Community Posts</strong><br><br>";    
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='submitTips'>";
    phaseCheckBoxes += "        <label for='submitTips'>Submit Tips</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='viewAdminTips'>";
    phaseCheckBoxes += "        <label for='viewAdminTips'>View Admin Tips</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='viewConditionGroupTips'>";
    phaseCheckBoxes += "        <label for='viewConditionGroupTips'>View Condition Group Tips</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='viewSubTeamTips'>";
    phaseCheckBoxes += "        <label for='viewSubTeamTips'>View Sub-team Tips</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='sharePostsToSocialMedia' disabled>";
    phaseCheckBoxes += "        <label for='sharePostsToSocialMedia'>Share Posts to Social Media</label><br>";
    phaseCheckBoxes += "</div>";    
    
    phaseCheckBoxes += "<div class='col-sm-4'>";
    phaseCheckBoxes += "    <br><strong>Rewards</strong><br><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='private'>";
    phaseCheckBoxes += "        <label for='private'>Private</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='public' disabled>";
    phaseCheckBoxes += "        <label for='public'>Public</label><br>";
    phaseCheckBoxes += "        <input type='checkbox' name='phasePermissions_" + cg + "_" + ph + "[]' value='progressionSystem' disabled>";
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
    phaseCheckBoxes += "        <input type='text' class='form-control' id='entriesNum_" + cg + "_" + ph + "' name='entriesNum_" + cg + "_" + ph + "' value='0'>";
    phaseCheckBoxes += "    </div>";
    phaseCheckBoxes += "    <label for='postsNum_" + cg + "_" + ph + "' class='col-sm-1 control-label'>Posts</label>";
    phaseCheckBoxes += "    <div class='col-sm-3'>";
    phaseCheckBoxes += "        <input type='text' class='form-control' id='postsNum_" + cg + "_" + ph + "' name='postsNum_" + cg + "_" + ph + "' value='0'>";
    phaseCheckBoxes += "    </div>";
    phaseCheckBoxes += "    <label for='likesNum_" + cg + "_" + ph + "' class='col-sm-1 control-label'>Likes</label>";
    phaseCheckBoxes += "    <div class='col-sm-3'>";
    phaseCheckBoxes += "        <input type='text' class='form-control' id='likesNum_" + cg + "_" + ph + "' name='likesNum_" + cg + "_" + ph + "' value='0'>";
    phaseCheckBoxes += "    </div>";
    phaseCheckBoxes += "    <p style='padding:6px;'></p>";
    phaseCheckBoxes += "</div>";    
    phaseCheckBoxes += "<p style='padding:6px;'></p>";

    return phaseCheckBoxes;
}

