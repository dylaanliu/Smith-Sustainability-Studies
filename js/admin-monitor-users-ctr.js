// jQuery functions for admin monitor users pages
// ********************************
// NOTE: DO NOT HAVE ANDYTHING IN $(document).ready(function() since this controls a 
//    dynamically loaded VIEW. Use only for testing
// ********************************

// go to content div and shove some stuff in

var monitorUsersTable;
var adminMonitorUsersController = "server/admin-monitor-users-ctr.php" + "?_=" + (new Date()).getTime();  // load from server always
var studiesArray;
var conditionGroupPhasesArray;
var usersArray;
var dailyEntriesArray;
var hiddenStudiesArray = [];
var hiddenUsersArray = [];
var colHeaders = [];
var userEntryLookup = [];

$(document).ready(function() {
    
});


function loadAdminMonitorUsersView() {
    var view = "views/admin-monitor-users-view.html";
    var controllerData = { q: "getAll" };

    // clear contents first
    document.getElementById("viewGoesHere").innerHTML = "";

    // go to server and load in view for this portion of the page
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){

        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
           
            $.getJSON(adminMonitorUsersController, controllerData, function(result) {
                // console.log(JSON.stringify(result));
                console.log('errorMsg='+result.errorMsg);
                if (result.error)
                    alert(result.errorMsg);
                else {
                    // get data from server
                    studiesArray = result.studies;
                    conditionGroupPhasesArray = result.conditionGroupPhases;
                    usersArray = result.users;
                    dailyEntriesArray = result.dailyEntries;
                    hiddenStudiesArray = [];
                    hiddenUsersArray = [];
                    renderSelectors();
                    renderMonitorUserTable();
                }
            });
        };
    });    
}

function renderSelectors() {
    var addStudySelectorStr = "<option value='0' selected></option>";
    var removeStudySelectorStr = "<option value='0' selected></option>";
    var addUserSelectorStr = "<option value='0' selected></option>";
    var removeUserSelectorStr = "<option value='0' selected></option>";
    
    // create selectors
    $("#addStudySelector").empty();
    $("#removeStudySelector").empty();    
    var firstAddStudy = true;
    var firstRemoveStudy = true;
    studiesArray.forEach(function(study, studyIndex) {
        if ( hiddenStudiesArray.indexOf( study.studyID ) > -1  ) {
            if (firstAddStudy) {
                firstAddStudy = false;
                addStudySelectorStr += "<option selected value=" + study.studyID + ">StudyID " + study.studyID + ": " + study.description + "</option>";
            } else
                addStudySelectorStr += "<option value=" + study.studyID + ">StudyID " + study.studyID + ": " + study.description + "</option>";
        }
        else {
            if (firstRemoveStudy) {
                firstRemoveStudy = false;
                removeStudySelectorStr += "<option selected value=" + study.studyID + ">StudyID " + study.studyID + ": " + study.description + "</option>";            
            } else
                removeStudySelectorStr += "<option value=" + study.studyID + ">StudyID " + study.studyID + ": " + study.description + "</option>";            
        }
    });
    $("#addStudySelector").append(addStudySelectorStr);
    $("#removeStudySelector").append(removeStudySelectorStr);
        
    // create selectors
    $("#addUserSelector").empty();
    $("#removeUserSelector").empty();
    var firstAddUser = true;
    var firstRemoveUser = true;
    usersArray.forEach(function(user, userIndex) {
        if (user.studyID <= 0)    // user must be in a Study
            return;
        if ( hiddenUsersArray.indexOf( user.userID ) > -1  ) {
            if (firstAddUser) {
                firstAddUser = false;
                addUserSelectorStr += "<option selected value=" + user.userID + ">UserID " + user.userID + ": " + user.userName + "</option>";
            } else
                addUserSelectorStr += "<option value=" + user.userID + ">UserID " + user.userID + ": " + user.userName + "</option>";
        }
        else {
            if (firstRemoveUser) {
                firstRemoveUser = false;
                removeUserSelectorStr += "<option selected value=" + user.userID + ">UserID " + user.userID + ": " + user.userName + "</option>";            
            } else
                removeUserSelectorStr += "<option value=" + user.userID + ">UserID " + user.userID + ": " + user.userName + "</option>";            
        }
    });
    $("#addUserSelector").append(addUserSelectorStr);
    $("#removeUserSelector").append(removeUserSelectorStr);
        
}

function renderMonitorUserTable() {

    // determine the entry date columns
    dailyEntriesArray.forEach(function(dailyEntries, index) {
        if (colHeaders.indexOf(dailyEntries.entryDate) == -1) {
            colHeaders.push(dailyEntries.entryDate);
        }
    });
    
    // insert the column headers into the table
    $("#insertMonitorUserTableHeader").empty();
    tableHeaderStr = "<th>Study ID</th><th>Group</th><th>User ID</th><th class='no-sort'></th>";
    colHeaders.forEach(function(colName, index) {
        tableHeaderStr += "<th class='no-sort'>" + colName + "</th>";
    });
    $("#insertMonitorUserTableHeader").append(tableHeaderStr);

    // create a 2-D array of user/colHeader containing daily entries to help
    // create table body
    userEntryLookup = new Array(usersArray.length);
    for (i = 0; i < usersArray.length; i++) {
        userEntryLookup[i] = new Array(colHeaders.length);
        for (j = 0; j < colHeaders.length; j++)
            userEntryLookup[i][j] = null; 
    }
    dailyEntriesArray.forEach(function(entry, index2) {
        var userIndex = 0;
        usersArray.forEach(function(user, index) {
            if (user.userID == entry.userID) {
                userIndex = index;
                return;
            }
        });
        var colIndex = 0;
        colHeaders.forEach(function(colHeader, index) {
            if (colHeader == entry.entryDate) {
                colIndex = index;
                return;
            }
        });
        userEntryLookup[userIndex][colIndex] = entry;
    });

    // 
    // insert data
    var tableBodyStr = "";
    studiesArray.forEach(function(study, studyIndex) {
        // only include Study Groups that are not hidden
        if (hiddenStudiesArray.indexOf(study.studyID) != -1)
            return;
        var uniqueCG = [];                                                          // keeps track of the unique conditionGroup
        
        conditionGroupPhasesArray.forEach(function(conditionGroupPhase, conditionGroupPhaseIndex) {
            // only process unique CG for study
            if (conditionGroupPhase.studyID != study.studyID || uniqueCG.indexOf(conditionGroupPhase.conditionGroupNum) != -1)  
                return;
            uniqueCG.push(conditionGroupPhase.conditionGroupNum);

            usersArray.forEach(function(user, userIndex) {
                // only process users that are in the study and are not hidden
                if (hiddenUsersArray.indexOf(user.userID) != -1 || user.studyID != study.studyID)                               
                    return;

                for (i = 0; i < 5; i++) {                    // 5 rows per user (start,end,share,post,likes)
                    for (j = 0; j < colHeaders.length; j++) {
                        if (j == 0) {
                            tableBodyStr += "<tr><td>" + study.studyID + "</td><td>" 
                                                   + conditionGroupPhase.conditionGroupNum + "</td><td>" 
                                                   + user.userID + "</td>"
                            switch (i) {
                                case 0: tableBodyStr += "<td>Start</td>"; break;
                                case 1: tableBodyStr += "<td>End</td>"; break;
                                case 2: tableBodyStr += "<td>Shares</td>"; break;
                                case 3: tableBodyStr += "<td>Posts</td>"; break;
                                case 4: tableBodyStr += "<td>Likes</td>"; break;
                            }
                        } 
                        // check for the existance of a entry for the user on a particular date
                        entry = userEntryLookup[userIndex][j];
                        if (entry != null && entry.conditionGroupNum == conditionGroupPhase.conditionGroupNum) {
                            switch (i) {
                                case 0: tableBodyStr += "<td>" + entry.startEnergy + "</td>"; break;
                                case 1: tableBodyStr += "<td>" + entry.endEnergy + "</td>"; break;
                                case 2: tableBodyStr += "<td>" + entry.numShares + "</td>"; break;
                                case 3: tableBodyStr += "<td>" + entry.numPosts + "</td>"; break;
                                case 4: tableBodyStr += "<td>" + entry.numLikes + "</td>"; break;
                            }
                        }
                        else {
                            tableBodyStr += "<td></td>";
                        }
                    }
                    tableBodyStr += "</tr>";
                }
            })
        })
    });
    $("#insertMonitorUserTableBody").empty();
    $("#insertMonitorUserTableBody").append(tableBodyStr);

    monitorUsersTable = $("#monitorUserTable").DataTable({

        scrollY:        "400px",
        scrollX:        true,                               // allow horizontal scrolling
        scrollCollapse: true,
        paging:         false,
//                        ordering:       false,
        fixedColumns:   {
            leftColumns: 4,                                 // left columns fixed
        },
         aoColumnDefs : [
            {
             'bSortable' : false, 'aTargets' : ['no-sort']}
        ]
    });                    
}


// save text as a file in the download directory
function saveTextAsFile(textToSave) {
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var toSaveAsFilename = document.getElementById("adminMonitorUserToSaveAsFilename").value;
 
    var downloadLink = document.createElement("a");
    downloadLink.download = toSaveAsFilename;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
//    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
}


// returns string containing table contexts in CSV format
function getFileData() {
    var fileStr = "";

    // column headers
    fileStr = "Study ID, Group, User ID, ,";
    colHeaders.forEach(function(colName, index) {
        if (index == colHeaders.length - 1)
            fileStr += colName + "\r\n";
        else
            fileStr += colName + ", ";
    });
    
    studiesArray.forEach(function(study, studyIndex) {
        // only include Study Groups that are not hidden
        if (hiddenStudiesArray.indexOf(study.studyID) != -1)
            return;
        var uniqueCG = [];                                                          // keeps track of the unique conditionGroup
        
        conditionGroupPhasesArray.forEach(function(conditionGroupPhase, conditionGroupPhaseIndex) {
            // only process unique CG for study
            if (conditionGroupPhase.studyID != study.studyID || uniqueCG.indexOf(conditionGroupPhase.conditionGroupNum) != -1)  
                return;
            uniqueCG.push(conditionGroupPhase.conditionGroupNum);

            usersArray.forEach(function(user, userIndex) {
                // only process users that are in the study and are not hidden
                if (hiddenUsersArray.indexOf(user.userID) != -1 || user.studyID != study.studyID)                               
                    return;
                for (i = 0; i < 5; i++) {                    // 5 rows per user (start,end,share,post,likes)
                    for (j = 0; j < colHeaders.length; j++) {
                        if (j == 0) {
                            fileStr += study.studyID + ", " 
                                     + conditionGroupPhase.conditionGroupNum + ", " 
                                     + user.userID + ", "
                            switch (i) {
                                case 0: fileStr += "Start, "; break;
                                case 1: fileStr += "End, "; break;
                                case 2: fileStr += "Shares, "; break;
                                case 3: fileStr += "Posts, "; break;
                                case 4: fileStr += "Likes, "; break;
                            }
                        } 
                        // check for the existance of a entry for the user on a particular date
                        entry = userEntryLookup[userIndex][j];
                        if (entry != null && entry.conditionGroupNum == conditionGroupPhase.conditionGroupNum) {
                            switch (i) {
                                case 0: fileStr += entry.startEnergy; break;
                                case 1: fileStr += entry.endEnergy; break;
                                case 2: fileStr += entry.numShares; break;
                                case 3: fileStr += entry.numPosts; break;
                                case 4: fileStr += entry.numLikes; break;
                            }
                        }
                        else {
                            fileStr += "0";
                        }
                        if (j != colHeaders.length - 1)
                            fileStr += ", ";
                        else
                            fileStr += "\r\n";
                    }
                }
            })
        })
    });
    return fileStr;
}


// Click controller for the remove study from table button. If
// remove button selected, find the studyID of the study to remove
// and add it into the hiddenStudiesArray Array so it wont get displayed.
$("#viewGoesHere").on( "click", "#removeStudyButton", function() {
    var studyID = $( "#removeStudySelector" ).val();
    console.log('remove study=' + studyID); 

    hiddenStudiesArray.push(studyID);
    monitorUsersTable.destroy();
    renderSelectors();
    renderMonitorUserTable();
}); 


// Click controller for the add study from table button. If the add
// button is selected, remove the element from the hiddenStudiesArray
// so that the study will be displayed.
$("#viewGoesHere").on( "click", "#addStudyButton", function() {
    var studyID = $( "#addStudySelector" ).val();
    console.log('add study=' + studyID);
    
    var i = hiddenStudiesArray.indexOf(studyID);
    if(i != -1) 
        hiddenStudiesArray.splice(i, 1);
    monitorUsersTable.destroy();
    renderSelectors();
    renderMonitorUserTable();
}); 


// Click controller for the remove User from table button. If clicked,
// get the userID from the select and add it to the 
// hiddenUsersArray so it wont be displayed.
$("#viewGoesHere").on( "click", "#removeUserButton", function() {
    var userID = $( "#removeUserSelector" ).val();
    console.log('remove user=' + userID); 

    hiddenUsersArray.push(userID);
    monitorUsersTable.destroy();
    renderSelectors();
    renderMonitorUserTable();
}); 


// Click controller for the add User from table button. If clicked,
// get the userID from the select and remove it from the 
// hiddenUsersArray so it will be displayed.
$("#viewGoesHere").on( "click", "#addUserButton", function() {
    var userID = $( "#addUserSelector" ).val();
    console.log('add user=' + userID); 

    var i = hiddenUsersArray.indexOf(userID);
    if(i != -1) 
        hiddenUsersArray.splice(i, 1);
    monitorUsersTable.destroy();
    renderSelectors();
    renderMonitorUserTable();
}); 


// Click controller for the add and remove User from table buttons.
$("#viewGoesHere").on( "click", "#adminMonitorUserExtractRawData", function() {
    var filename = $("#adminMonitorUserToSaveAsFilename").val();
    filename = filename.trim();
    console.log('extract raw data button clicked, filename=' + filename); 
    
    if (filename == "") {
        alert("Please provide file name.")
    } else {
        var fileData = getFileData();
        saveTextAsFile(fileData);
    }
}); 
