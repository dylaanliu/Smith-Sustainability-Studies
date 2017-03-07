// jQuery functions for admin home page
// TODO: check go-to specific study on manage studies works 

// go to content div and shove some stuff in
$(document).ready(function() {
	
}); // end function

function loadAdminHomeView() {

//	var data_file = "adminhome.json"; // path to temp json file
    var controller = "server/admin-home-ctr.php"
    var controllerData = { q: "me", otherVar: "something" }
    var view = "views/admin-home-view.html";
    
	$("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            $.getJSON(controller, controllerData, function(result) {
                //console.log(JSON.stringify(result));
                //alert(result);
                var studyArray = result.data;
                // var studyContent = "";

                // clear contents first
                document.getElementById("currentStudiesTable").innerHTML = "";
                if (!result.error) {
                    // html injection
                    $.each(studyArray, function(index, studyRecord) {
                        $("#currentStudiesTable").append(
                            "<div class='col-sm-10 col-sm-offset-1'>" + 
                                "<h3>Study " + studyRecord.studyID + " " + studyRecord.title + ":</h3><p> "+ studyRecord.description +"</p>"+
                                "<div class='col-sm-6 col-sm-offset-2'></div>" +
                                "<div class='col-sm-2'><button type='button' name='manage' class='btn btn-info pull-left' id='" + studyRecord.studyID +
                                "'>Manage</button></div>" +
                                "<div class='col-sm-2'><button type='button' name='monitor' class='btn btn-info pull-left' id='" + studyRecord.studyID +
                                "'>Monitor</button></div>" +
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


// for Extract Raw Data Button click event
$("#viewGoesHere").on( "click", "#extractRawData", function(event){
	// replace with call to PHP retrieve
	alert("Extracting data: NOT IMPLEMENTED");
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
    console.log("going to manage a study");
    console.log("studyID = " + studyID);
    alert("NOT IMPLEMENTED");
});
	
// for individual Manage Study Buttons in Current Studies Table
$("#viewGoesHere").on( "click", "#currentStudiesTable button[name='monitor']", function(event){
    var studyID = this.id;
    console.log("going to monitor a study");
    console.log("studyID = " + studyID);
    alert("NOT IMPLEMENTED");
});
	
	
