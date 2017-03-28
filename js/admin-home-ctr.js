// jQuery functions for admin home page
// TODO: check go-to specific study on manage studies works 

// go to content div and shove some stuff in
$(document).ready(function() {
    
}); // end function

function loadAdminHomeView() {

    var controller = "server/admin-home-ctr.php"
    var controllerData = { q: "getAdminStudies", timestamp: "time_" + (new Date()).getTime() }
    var view = "views/admin-home-view.html";

    //make link on nav active
    $('.nav li').removeClass('active');
    $('#adminHome').addClass('active');
    
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            $.getJSON(controller, controllerData, function(result) {
                console.log(JSON.stringify(result));
                //alert(result);
                var studyArray = result.data;
                // var studyContent = "";

                // clear contents first
                document.getElementById("currentStudiesTable").innerHTML = "";
                if (!result.error) {
                    // html injection
                    $.each(studyArray, function(index, studyRecord) {
                        $("#currentStudiesTable").append(
                        "<div class='row'>" + 
                            "<div class='col-md-12 col-sm-12 col-xs-12'>" + 
                                "<h3 style='float: left;'>Study " + studyRecord.studyID + ": </h3>"+
                                "<h4>" + studyRecord.title + "</h4>"+
                            "</div>"+
                        "</div>" + 
                        "<div class='row'>" + 
                            "<div class='col-md-11 col-md-offset-1'>"+
                                "<p>" + studyRecord.description +
                                "</p>"+
                            "</div>"+
                        "</div>" + 
                        "<div class='row'>" + 
                        "<div class='col-sm-6 col-sm-offset-2'></div>" + 
                        "<div class='col-sm-2'>"+
                            "<button type='button' name='manage' class='btn btn-info pull-left' id='" + studyRecord.studyID + "'>Manage</button>"+
                        "</div>" +
                        "<div class='col-sm-2'>"+
                            "<button type='button' name='monitor' class='btn btn-info pull-left' id='" + studyRecord.studyID + "'>Monitor</button>"+
                        "</div>" + 
                        "</div>" + 
                        "<div class='row'>"+
                            "<div class='col-md-12'>"+
                                "<div class='separator'>"+
                                    "<a href='#'></a>"+
                                "</div>" + 
                            "</div>" + 
                        "</div>"); 
                    }); // end each
                }
                else {
                    console.log(result.errorMsg);
                }
            });
        }
    });
} // end function


// TODO - for Extract Raw Data Button click event
$("#viewGoesHere").on( "click", "#extractRawData", function(event){
    var controller = "server/admin-home-ctr.php"
    var controllerData = { q: "getAll" }

    $.getJSON(controller, controllerData, function(result) {
        console.log(JSON.stringify(result));
        console.log('errorMsg=' + result.errorMsg);
        if (result.error)
            alert(result.errorMsg);
        else {
            // get data from server
            var studiesArray = result.studies;
            var conditionGroupPhasesArray = result.conditionGroupPhases;
            var usersArray = result.users;
            var dailyEntriesArray = result.dailyEntries;
            var postArray = result.posts;
            
            // print out CSV fileSize
            fileString = tableToCSVString(studiesArray);
            saveTextToFile("studyTable.csv", fileString);

            fileString = tableToCSVString(conditionGroupPhasesArray);
            saveTextToFile("conditionGroupPhaseTable.csv", fileString);

            fileString = tableToCSVString(usersArray);
            saveTextToFile("userTable.csv", fileString);

            fileString = tableToCSVString(dailyEntriesArray);
            saveTextToFile("dailyEntriesTable.csv", fileString);

            fileString = tableToCSVString(postArray);
            saveTextToFile("postTable.csv", fileString);
        }
    });    
});

// for Create New Study Button click event
$("#viewGoesHere").on( "click", "#createNewStudy", function(event){
    console.log("going to create study page");
    loadAdminCreateStudyView();
});

// for Create User Account Button click event
$("#viewGoesHere").on( "click", "#createUserAccount", function(event){
    console.log("create user");
    loadAdminUserAccountsView(true);
});

// for Manage User Account Button click event
$("#viewGoesHere").on( "click", "#manageUserAccount", function(event){
    console.log("going to manage user page");
    loadAdminUserAccountsView(false);
});
    
// for individual Manage Study Buttons in Current Studies Table
$("#viewGoesHere").on( "click", "#currentStudiesTable button[name='manage']", function(event){
    var studyID = this.id;
    loadAdminManageStudiesView(studyID);
});
    
// for individual Manage Study Buttons in Current Studies Table
$("#viewGoesHere").on( "click", "#currentStudiesTable button[name='monitor']", function(event){
    var studyID = this.id;
    loadAdminMonitorStudiesView();
});
    


// returns string containing table and contexts in CSV format
function tableToCSVString(table) {
    var fileStr = "";
    var first = true;

    if (table.length <= 0)
        return fileStr;
    
    // get column headers
    for (var key in table[0]) {
        if (table[0].hasOwnProperty(key)) {
            if (first) {
                fileStr += key;                
                first = false;
            } 
            else {
                fileStr += ", " + key;                
            }
        }
    }
    fileStr += "\r\n";
    
    // get contents of the table
    table.forEach(function(element, elementIndex) {
        first = true;
        // get column headers
        for (var key in element) {
            if (first) {
                fileStr += element[key];                
                first = false;
            } 
            else {
                fileStr += ", " + element[key];                
            }
        }
        fileStr += "\r\n";
    });
    return fileStr;
}

    
