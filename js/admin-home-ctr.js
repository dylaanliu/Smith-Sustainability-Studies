// jQuery functions for admin home page
// TODO: check go-to specific study on manage studies works 

// go to content div and shove some stuff in
$(document).ready(function() {

	loadAdminHomeView();
	
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
                // change to response text
                //alert(result);
                var studyArray = result;
                // var studyContent = "";

                // clear contents first
                document.getElementById("content").innerHTML = "";
                
                // html injection
                $.each(studyArray.Studies, function(index, studyRecord) {
                    $("#content").append(
                        "<div class='col-sm-10 col-sm-offset-1'>" + 
                            "<h3>Study " + studyRecord.studyId + " " + studyRecord.title + ":</h3><p> "+ studyRecord.description +"</p>"+
                            "<div class='col-sm-6 col-sm-offset-2'></div>" +
                            "<div class='col-sm-2'><button type='button' class='btn btn-info pull-left' id='manage-" + studyRecord.studyId +
                            "' onclick=goToManage(this)>Manage</button></div>" +
                            "<div class='col-sm-2'><button type='button' class='btn btn-info pull-left' id='monitor-" + studyRecord.studyId +
                            "' onclick=goToMonitor(this)>Monitor</button></div>" +
                        "</div>"); 
                }); // end each
            });
        }
	});
} // end function

$("#extract").click(function(){
	// replace with call to PHP retrieve
	alert("Extracting data");

});

$("#create-study").click(function(){
	alert("going to create study page");
	window.location.replace("create-study.html");
});

$("#create-user").click(function(){
	alert("create user");
	// do we want a create user pop-up form though?
	window.location.replace("manage-users.html");
});

$("#manage-user").click(function(){
alert("going to manage user page");
window.location.replace("manage-users.html");
});
	
$("#logout").click(function(){
	// replace with logout php function call
	alert("Logging out");
});

// redirect to specific study on manage page
function goToManage(element){
	alert(element.id);
	window.location.replace("manage-studies.html/#"+element.id);
}

// redirect to specific study on monitor page
function goToMonitor(element){
	alert(element.id);
	window.location.replace("monitor-studies.html/#"+element.id);
}