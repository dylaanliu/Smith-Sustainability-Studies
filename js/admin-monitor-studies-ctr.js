// jQuery functions for admin home page
// TODO: check go-to specific study on manage studies works 

// go to content div and shove some stuff in
$(document).ready(function() {
	
}); // end function

function loadAdminMonitorStudiesView() {

//	var data_file = "adminhome.json"; // path to temp json file
    var controller = "server/admin-monitor-studies-ctr.php";
    var adminStudyQuery = { q: "get_admin_studies", otherVar: "something" };
    var view = "views/admin-monitor-studies-view.html";
    
	$("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            console.log("success");
            $.getJSON(controller, adminStudyQuery, function(result) {
                console.log("in Get");
                console.log(JSON.stringify(result));
                //alert(result);
                var studyArray = result.data;
                // var studyContent = "";

                // clear contents first
                document.getElementById("currentStudiesTable").innerHTML = "";
                if (!result.error) {
                    // html injection
                    $.each(studyArray, function(index, studyRecord) {
                        console.log("inserting html");
                        $("#currentStudiesTable").append(
                            "<div class='panel panel-info'>" +
                                "<div class='panel-heading'>"+ 
                                    "<h3 class='panel-title'>"+
                                       // "<a class='accordion-toggle' data-toggle='collapse' href='#collapse-"+studyRecord.studyID+"'>"+
                                            "Study " + studyRecord.studyID + " " + studyRecord.title + ":" +
                                       // "</a>"+
                                    "</h3>"+
                                    "<p> "+ studyRecord.description +"</p>"+                                        
                                "</div>"+
                                "<div class='row' id='row-"+studyRecord.studyID+"'>"+
                                    "<div class='col-sm-5 col-sm-offset-1'>"+
                                    "<a class='accordion-toggle' data-toggle='collapse' href='#collapse-"+studyRecord.studyID+"'>"+
                                        "<button type='button' name='viewResults' class='btn btn-info pull-left' id='" + studyRecord.studyID +
                                    "'>View Results</button></a></div>" +
                                    "<div class='col-sm-5 col-sm-offset-1'><button type='button' name='communityPosts' class='btn btn-info pull-left' id='" + studyRecord.studyID +
                                    "'>Manage Community Posts</button></div>" +
                                    "<div id='collapse-"+studyRecord.studyID+"' class='panel-collapse collapse'>"+
                                        "<div class='panel-body' id='collapse-"+studyRecord.studyID+"'>"+
                                            "<div id='infoGoesHere-"+studyRecord.studyID+"'>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                                

                            "</div>"); 
                            viewResults(studyRecord.studyID);
                    }); // end each


                }
                else {
                    console.log(result.errorMsg);
                }
            });
        }
	});
} // end function

	
// for individual View Results Buttons in Current Studies Table
/*$("#viewGoesHere").on( "click", "#currentStudiesTable button[name='viewResults']", function(event){
    var studyID = this.id;
    console.log("going to view results");
    console.log("studyID = " + studyID);
    //viewResults(studyID);

    var x = document.getElementById('#infoGoesHere');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
    //alert("NOT IMPLEMENTED");
});*/
	
// for individual Manage Community Buttons in Current Studies Table
$("#viewGoesHere").on( "click", "#currentStudiesTable button[name='communityPosts']", function(event){
    var studyID = this.id;
    console.log("going to monitor a community");
    console.log("studyID = " + studyID);
    alert("NOT IMPLEMENTED");
});
	
	
function viewResults(studyID){
    var controller = "server/admin-monitor-studies-ctr.php";
    var singleStudyQuery = { q: "get_study_data", studyID: studyID};
    console.log("getting view results");

    // append initial html not dependent on study
    $("#infoGoesHere-"+studyID).append(
        "<div class='row' id='selector'>"+
            "<h3>Select Parameters</h3>"+
            "<form class='form-inline' id='select-form'>"+
                "<div class='form-group col-sm-4'>"+
                    "<div id='conditionGroups-"+studyID+"'>"+
                        "<h4>Condition Groups</h4>"+
                        "<div class='form-check' id='all'>"+
                            "<label><input type='checkbox' value=''>All</label>"+
                        "</div>"+                        
                    "</div>"+
                "</div>"+
                "<div class='form-group col-sm-2'>"+
                    "<div id='phases-"+studyID+"'>"+
                        "<h4>Phases</h4>"+
                        "<div class='form-check' id='all'>"+
                            "<label><input type='checkbox' value=''>All</label>"+
                        "</div>"+                        
                    "</div>"+                    
                "</div>"+     
                "<div class='form-group col-sm-4 col-sm-offset-1' id='data'>"+
                    "<h4>Data Format</h4>"+
                    "<div class='form-check' id='perConditionGroup'>"+
                        "<label><input type='checkbox' value=''>Data input per condition group</label>"+
                    "</div>"+    
                    "<div class='form-check' id='communityPostsPerConditionGroup'>"+
                        "<label><input type='checkbox' value=''>Community posts per condition group</label>"+
                    "</div>"+
                    "<div class='form-check' id='tableOfData'>"+
                        "<label><input type='checkbox' value=''>Table of data</label>"+
                    "</div>"+                                                                                         
                "</div>"+ 
                "<div class='form-group col-sm-offset-4'>"+
                    "<button type='submit' class='btn btn-primary' id="+studyID+">Get Data</button>"+
                "</div>"+                          
            "</form>"+
        "</div>"+
        "<div class='row' id='dataSpace'>"+
        "</div>"
    );

    $.getJSON(controller, singleStudyQuery, function(result) {
        if (!result.error) {
            // html injection
            console.log("successful get");
            console.log(result.data[0].conditionGroups);

            for(var cNum = 0; cNum < result.data[0].conditionGroups; cNum++){
                console.log("filling in cg "+cNum);
                $("#conditionGroups-"+studyID).append(
                    "<div class='checkbox' id='conditionGroup-'"+cNum+">"+
                        "<label><input type='checkbox' value=''>Condition Group "+cNum+"</label>"+
                    "</div>"  
                );
            }

            for(var pNum = 0; pNum < result.data[0].phases; pNum++){
                console.log("filling in phase "+pNum);
                $("#phases-"+studyID).append(
                    "<div class='checkbox' id='phases-'"+pNum+">"+
                        "<label><input type='checkbox' value=''>Phase "+pNum+"</label>"+
                    "</div>"  
                );
            }
        }
        else {
            console.log(result.errorMsg);
        }
    });
}
