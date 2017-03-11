// jQuery functions for admin home page
// TODO: check go-to specific study on manage studies works 

// go to content div and shove some stuff in
$(document).ready(function() {
	
}); // end function

// var controller = "server/admin-monitor-studies-ctr.php";

function loadAdminMonitorStudiesView() {
    var controller = "server/admin-monitor-studies-ctr.php";

//	var data_file = "adminhome.json"; // path to temp json file
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
                                    "<div class='row'>"+
                                        "<h3 class='panel-title'>"+
                                            "Study " + studyRecord.studyID + " " + studyRecord.title + ":" +

                                        "</h3>"+
                                        "<p> "+ studyRecord.description +"</p>"+    
                                        "<div class='col-sm-3 col-sm-offset-3'>"+
                                            "<a class='accordion-toggle' data-toggle='collapse' href='#collapse-"+studyRecord.studyID+"'>"+
                                                "<button type='button' name='viewResults' class='btn btn-info pull-left' id='" + studyRecord.studyID +
                                                "'>View Results</button>"+
                                            "</a>"+
                                        "</div>" +
                                        "<div class='col-sm-3 col-sm-offset-1'>"+
                                            "<a class='accordion-toggle' data-toggle='collapse' href='#collapse-"+studyRecord.studyID+"'>"+
                                                "<button type='button' name='communityPosts' class='btn btn-info pull-left' id='" + studyRecord.studyID +
                                                "'>Manage Community Posts</button>"+
                                            "</a>"+
                                        "</div>" +  
                                    "</div>"+                                  
                                "</div>"+
                                "<div class='row' id='row-"+studyRecord.studyID+"'>"+

                                    "<div id='collapse-"+studyRecord.studyID+"' class='panel-collapse collapse'>"+
                                        "<div class='panel-body' id='collapse-"+studyRecord.studyID+"'>"+
                                            "<div id='infoGoesHere-"+studyRecord.studyID+"'>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                                

                            "</div>"); 
                            //viewResults(studyRecord.studyID);
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
$("#viewGoesHere").on( "click", "#currentStudiesTable button[name='viewResults']", function(event){
    var studyID = this.id;
    console.log("going to view results");
    console.log("studyID = " + studyID);
    viewResults(studyID);

/*    var x = document.getElementById('#infoGoesHere');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }*/
    //alert("NOT IMPLEMENTED");
});

// *****************************************
// This section to do with button management 
// *****************************************
	
// for individual Manage Community Buttons in Current Studies Table
$("#viewGoesHere").on( "click", "#currentStudiesTable button[name='communityPosts']", function(event){
    var studyID = this.id;
    console.log("going to monitor a community");
    console.log("studyID = " + studyID);
    //var conditionGroup = "1";
    //var phase = "2";
    viewCommunityPosts(studyID);
    //alert("NOT IMPLEMENTED");
});

//function cgAll(studyID){
//    
   $("#viewGoesHere").on("click", "#cgCheckAll", function (event) {
        var temp = this.className;
        console.log(temp);
        var studyID = temp.slice(8);
        console.log("cg All: " + studyID);
        $(".checkCG-"+studyID).prop('checked', $(this).prop('checked'));
    }); 
//}
//function phaseAll(studyID){
//    
    $("#viewGoesHere").on("click", "#phaseCheckAll", function (event) {
        var temp = this.className;
        var studyID = temp.slice(11);
        console.log("phase All: " + studyID);
        $(".checkPhase-"+studyID).prop('checked', $(this).prop('checked'));
    });
//}


// ****************************************
// This section to do with View Results 
// ****************************************

$("#viewGoesHere").on( "click", "#select-form button[name='submitParameters']", function(event){
    var studyID = this.id;
    //console.log("going to load diagram");
   // console.log("studyID = " + studyID);
    event.preventDefault();

    var dataChoice = $("input[name=dataChoice]:checked");
    var dataID = dataChoice.attr('id'); //get which type of data to format
    var selectedConditionGroups = [];
    var selectedPhases = [];

    $("input:checkbox[name=cgCheck]:checked").each(function(){
        //console.log("cg checked: "+$(this).attr('id'));
        // ensure adding the correct checkboxes to be passed
        var temp = this.className;
        var checkStudyID = temp.slice(8);
        if(studyID == checkStudyID)
            selectedConditionGroups.push($(this).attr('id'));
    });
    $("input:checkbox[name=phaseCheck]:checked").each(function(){
        //console.log("phase checked: "+$(this).attr('id'));
        var temp = this.className;
        var checkStudyID = temp.slice(11);
        if(studyID == checkStudyID)
            selectedPhases.push($(this).attr('id'));
    });

    if(selectedConditionGroups.length == 0 && selectedPhases.length == 0) {
        alert("Please select at least one condition group and/or phase");
    } else {

        if (dataChoice == 'perConditionGroup'){
            generatePerConditionGroup(studyID, selectedConditionGroups, selectedPhases);
        } else if (dataChoice == 'postsPerCG') {
            generatePostsPerCG(studyID, selectedConditionGroups, selectedPhases);
        } else if (dataChoice == 'tableOfData') {
            generateTableOfData(studyID, selectedConditionGroups, selectedPhases);
        } else {
            console.log("Error: Unrecognized data format");
        }
    }

    // get the checked boxes

    console.log(dataID);
    console.log(selectedConditionGroups);
    console.log(selectedPhases);
    //alert("Getting view");
});
	
	
function viewResults(studyID){
    var controller = "server/admin-monitor-studies-ctr.php";
    var singleStudyQuery = { q: "get_study_data", studyID: studyID};
    console.log("getting view results");

    document.getElementById("infoGoesHere-"+studyID).innerHTML = "";
    // append initial html not dependent on study
    $("#infoGoesHere-"+studyID).append(
            "<h3>Select Parameters</h3>"+
            "<form class='form-inline' id='select-form'>"+
                "<div class='form-group col-sm-4'>"+
                    "<div id='conditionGroups-"+studyID+"'>"+
                        "<h4>Condition Groups</h4>"+
                        "<div class='form-check' id='all'>"+
                            "<label><input type='checkbox' class='checkCG-"+studyID+"' id='cgCheckAll'>"+
                            "All</label>"+
                        "</div>"+                        
                    "</div>"+
                "</div>"+
                "<div class='form-group col-sm-2'>"+
                    "<div id='phases-"+studyID+"'>"+
                        "<h4>Phases</h4>"+
                        "<div class='form-check' id='all'>"+
                            "<label><input type='checkbox' class='checkPhase-"+studyID+"' id='phaseCheckAll'>"+
                            "All</label>"+
                        "</div>"+                        
                    "</div>"+                    
                "</div>"+     
                "<div class='form-group col-sm-4 col-sm-offset-1' id='data'>"+
                    "<h4>Data Format</h4>"+
                    "<div class='form-check'>"+
                        "<label class='form-check-label'>"+
                            "<input class='form-check-input' type='radio' name='dataChoice' id='perConditionGroup' checked>"+
                                "Data input per condition group"+
                            "</label>"+
                    "</div>"+   
                    "<div class='form-check'>"+ 
                        "<label class='form-check-label'>"+
                            "<input class='form-check-input' type='radio' name='dataChoice' id='postsPerCG'>"+
                                "Community posts per condition group"+
                        "</label>"+
                    "</div>"+
                    "<div class='form-check'>"+ 
                        "<label class='form-check-label'>"+                     
                            "<input class='form-check-input' type='radio' name='dataChoice' id='tableOfData'>"+
                            "Table of data"+
                        "</label>"+
                    "</div>"+                                                                                         
                "</div>"+ 
                "<div class='form-group col-sm-offset-4'>"+
                    "<button type='submit' class='btn btn-primary' id="+studyID+" name='submitParameters'>Get Data</button>"+
                "</div>"+                          
            "</form>"+
        "<div class='row' id='dataSpace'>"+
        "</div>"
    );

    $.getJSON(controller, singleStudyQuery, function(result) {
        if (!result.error) {
            // html injection
            console.log("successful get");
            console.log(result.data[0].conditionGroups);

            for(var cNum = 0; cNum < result.data[0].conditionGroups; cNum++){
                console.log("filling in cg "+(cNum+1));
                $("#conditionGroups-"+studyID).append(
                    "<div class='checkbox'>"+
                        "<label><input type='checkbox' class='checkCG-"+studyID+"' name='cgCheck' id='"+(cNum+1)+"'>Condition Group "+(cNum+1)+
                        "</label>"+
                    "</div>"  
                );
            }

            for(var pNum = 0; pNum < result.data[0].phases; pNum++){
                console.log("filling in phase "+(pNum+1));
                $("#phases-"+studyID).append(
                    "<div class='checkbox'>"+
                        "<label><input type='checkbox' class='checkPhase-"+studyID+"' name='phaseCheck' id='"+(pNum+1)+"'>Phase "+(pNum+1)+
                        "</label>"+
                    "</div>"  
                );
            }
        }
        else {
            console.log(result.errorMsg);
        }
    });
}

function generatePerConditionGroup(studyID, selectedConditionGroups, selectedPhases){
    // bar graph
    alert("NOT IMPLEMENTED");
}

function generatePostsPerCG(studyID, selectedConditionGroups, selectedPhases) {
    // bar graph
    alert("NOT IMPLEMENTED");
}

function generateTableOfData(studyID, selectedConditionGroups, selectedPhases) {
    // dataTable
    alert("NOT IMPLEMENTED");
}

// ****************************************
// This section to do with Community Posts 
// ****************************************


function viewCommunityPosts(studyID) {
    var controller = "server/admin-monitor-studies-ctr.php";
    var communityQuery = { q: "get_study_data", studyID: studyID};

    document.getElementById("infoGoesHere-"+studyID).innerHTML = "";
    $("#infoGoesHere-"+studyID).append(
        "<form id='createCommunityForm' class='form-horizontal' role='form'>"+
            "<div class='form-group'>"+
                "<div id='tabsGoesHere-"+studyID+"' class='container col-sm-offset-1 col-sm-10'>"+    
                "</div>"+
            "</div>"+
        "</form>"
    );
    $.getJSON(controller, communityQuery, function(result) {
        if (!result.error) {
            // html injection
            console.log("successful get");
            var studyData = result.data[0];
            var numConditionGroups = studyData.conditionGroups;
            var numPhases = studyData.phases;

            $("#tabsGoesHere-"+studyID).append(monitorConditionGroupPhaseTabs(studyID, numConditionGroups, numPhases));
        }
        else {
            console.log(result.errorMsg);
        }

        $("#viewGoesHere").on("click", "#tabsGoesHere-"+studyID+" ul.nav-tabs a", function(e) {
            e.preventDefault();
            $(this).tab('show');
        });
    });


} 

function monitorConditionGroupPhaseTabs(studyID, numConditionGroups, numPhases) {
    var tabStr;
    
    // level 1
    tabStr = "<div class='tabbable boxed parentTabs' id='tabbable-"+studyID+"'>";
            
    // condition tabs
    tabStr += "<ul class='nav nav-tabs nav-justified'>";
    for (i = 1; i <= numConditionGroups; i++ ) {
        if (i == 1)
            tabStr += "<li class='active'><a href='#"+studyID+"-condition" + i + "'>Condition " + i + "</a></li>";  
        else
            tabStr += "<li><a href='#"+studyID+"-condition" + i + "'>Condition " + i + "</a></li>";  
    }
    tabStr += "</ul>";
    
    // level 2
    tabStr += "<div class='tab-content' id='tabContent-"+studyID+"'>";
    
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
                tabStr += "<li class='active'><a href='#"+studyID+"-condition" + cg + "Phase" + ph + "'>Phase " + ph + "</a></li>";  
            else
                tabStr += "<li><a href='#"+studyID+"-condition" + cg + "Phase" + ph + "'>Phase " + ph + "</a></li>";  
        }
        tabStr += "        </ul>";
        tabStr += "        <div class='tab-content' id='tabContent-"+studyID+"'>";  
        for (ph = 1; ph <= numPhases; ph++ ) {
            if (ph == 1)
                tabStr += "<div class='tab-pane fade active in' id='"+studyID+"-condition" + cg + "Phase" + ph + "'>";  
            else
                tabStr += "<div class='tab-pane' id='"+studyID+"-condition" + cg + "Phase" + ph + "'>";
            console.log("cg: "+cg+" ph: "+ph);  
            //tabStr += "<p>Condition Group " + cg + ", Phase " + ph + "</p>"; // buggy: cg does not update, but ph does
            //tabStr += displayPost(studyID, cg, ph); // this will do every combination; when select tabs, will show
//console.log("finished display post function");
            tabStr += "</div>";
        }        
        tabStr += "        </div>";
        tabStr += "    </div>";
        tabStr += "</div>";
    } 

    // close level 2
    tabStr += "</div>";

    // close level 1
    tabStr += "</div>";    //9
    //tabStr += "</div> <!--extra div????-->";

    console.log("cg: " + cg);
    //console.log(tabStr);
   // displayPost(studyID, cg, ph);
    var posts = displayPost(studyID, cg, ph);
    $("#condition"+cg+"Phase"+ph).append(posts);
    return tabStr;
} 

// currently breaks create study page
function displayPost(studyID, cg, ph) {
    var controller = "server/admin-monitor-studies-ctr.php";
    var postQuery = {q: "get_posts", studyID: studyID, conditionGroup: cg, phaseNum: ph };
    var post = "";

    $.getJSON(controller, postQuery, function(result) {
        if (!result.error) {
            // html injection
            console.log("successful get");
            //console.log(result);
            var postsArray = $.map(result.data, function(el){
                return el;
            });

            // sort by date
            postsArray.sort(function(postA, postB){
                return postA.dateTimeStamp - postB.dateTimeStamp;
            });

            post += "<div class='panel panel-primary'>";
            post +=     "<div class='panel-heading; id='outer'>Latest Posts</div>";
            post +=     "<div class='panel-body'>";
            post +=         "<div class='panel-group id='accordion'>";
            
            $.each(postsArray, function(key, postData){
        console.log(postData);            
            //var postData = result.data[0];
                var date = new Date(postData.dateTimeStamp);
                console.log("date: "+date.toLocaleString());
                console.log("post ID "+postData.postID);
                console.log("post image: " + postData.image);
                console.log("post text: " + postData.postText);
                if(postData.image != "") {
                    console.log("there's an image");
                    post +=            "<div class='panel panel-default' id='panel-"+postData.ID+"'>";
                    post +=                 "<div class='panel-heading'>";
                    post +=                     "<h4 class='panel-title'>";
                    post +=                         "<a class='accordion-toggle' data-toggle='collapse' href='#collapse-"+postData.postID+"'>";
                    post +=                             " <small><i>"+date.toLocaleString()+"</i></small>";
                    post +=                          "</a>";
                    post +=                          "<a href='#'>"; 
                    post +=                             "<i class='pe-7s-trash pe-2x pe-va pull-right' id='deletePost-"+postData.postID+"' onclick='deletePost("+postData.postID+")'></i>";
                    post +=                           "</a>";
                    post +=                      "</h4>";
                    post +=                  "</div>"; //10
                    post +=                   "<div id='collapse-"+postData.postID+"' class='panel-collapse collapse collapse in'>";
                    post +=                         "<div class='panel-body'>";
                    post +=                             "<p id='text'>"+postData.postText+"</p>";
                    post +=                             "<img src="+postData.image+" class='media-object' style='width:80px'>";
                    post +=                         "</div>";
                    post +=                   "</div>";
                    post +=             "</div>"; //13

                } else {
                    console.log("no image");
                    post +=            "<div class='panel panel-default' id='panel-"+postData.postID+"'>";
                    post +=                 "<div class='panel-heading'>";
                    post +=                     "<h4 class='panel-title'>";
                    post +=                         "<a class='accordion-toggle' data-toggle='collapse' href='#collapse-"+postData.postID+"'>";
                    post +=                             " <small><i>"+date.toLocaleString()+"</i></small>";
                    post +=                          "</a>";
                    post +=                          "<a href='#'>"; 
                    post +=                             "<i class='pe-7s-trash pe-2x pe-va pull-right' id='deletePost-"+postData.postID+"' onclick='deletePost("+postData.postID+")'></i>";
                    post +=                           "</a>";                    
                    post +=                      "</h4>";
                    post +=                  "</div>"; //10
                    post +=                   "<div id='collapse-"+postData.postID+"' class='panel-collapse collapse collapse in'>";
                    post +=                         "<div class='panel-body'>";
                    post +=                            "<p id='text'>"+postData.postText+"</p>";
                    post +=                         "</div>";
                    post +=                   "</div>";
                    post +=             "</div>"; //13
                }


            }); // end each
        } // end if
        else {
            console.log(result.errorMsg);
        }

        post +=            "</div> <!--End panel-group-->";
        post +=         "</div> <!--end panel-body-->";
        post +=       "</div> <!--end panel primary-->"; //20
        console.log(post);
        console.log("cg: "+ cg + " ph: " + ph);

        $("#infoGoesHere-"+studyID).append(post);
       // $("#"+studyID+"-condition"+cg+"Phase"+ph).append(post);
    });
    console.log("out of get");
   
    return post;
}

function deletePost(postID) {
    var controller = "server/admin-monitor-studies-ctr.php";

    var checkstr = confirm('Are you sure you want to delete this post?');
    if(checkstr == true) {
        // make DELETE request to server
        $.ajax({
            url: controller + '?' + $.param({"postID": postID}),
            type: 'DELETE',
            success: function(result, textStatus, xhr) {
                console.log(result);
                var data = result;
                console.log('errorMsg='+data.errorMsg);
                if (data.error)
                    alert(data.errorMsg);
/*                else {
                    var oTable = $('#userAccountsTable').dataTable(); 
                    oTable.fnDeleteRow(oTable.fnGetPosition(this.row));                
                }*/
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');           
            }             
        });
        return true;
    } else {
        return false;
    }
    
}