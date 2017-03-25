// jQuery functions for admin home page
// TODO: check go-to specific study on manage studies works 


$(document).ready(function() {
	
}); // end function

 var monitorStudiesController = "server/admin-monitor-studies-ctr.php";
// go to content div and shove some stuff in
function loadAdminMonitorStudiesView() {
    
//	var data_file = "adminhome.json"; // path to temp json file
    var adminStudyQuery = { q: "get_admin_studies", otherVar: "something" };
    var view = "views/admin-monitor-studies-view.html";
    
	$("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            console.log("success");
            $.getJSON(monitorStudiesController, adminStudyQuery, function(result) {
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
                                            "<a class='accordion-toggle btn btn-info pull-left' data-toggle='collapse' name='viewResults' id='results-" + studyRecord.studyID + "' href='#collapse-"+studyRecord.studyID+"''>"+
                                                // "<button type='button' name='viewResults' class='btn btn-info pull-left' id='" + studyRecord.studyID +
                                                // "'>View Results</button>"+
                                            "View Results</a>"+
                                        "</div>" +
                                        "<div class='col-sm-3 col-sm-offset-1'>"+
                                            "<a class='accordion-toggle btn btn-info pull-left' data-toggle='collapse'  name='communityPosts' id='posts-" + studyRecord.studyID + "' href='#collapse-"+studyRecord.studyID+"'>"+
//                                                "<button type='button' name='communityPosts' class='btn btn-info pull-left' id='" + studyRecord.studyID +
//                                                "'>Manage Community Posts</button>"+
                                            "Manage Community Posts</a>"+
                                        "</div>" +  
                                    "</div>"+                                  
                                "</div>"+
                                "<div class='row' id='row-"+studyRecord.studyID+"'>"+

                                    "<div id='collapse-"+studyRecord.studyID+"' class='panel-collapse collapse'>"+
                                        "<div class='panel-body'>"+
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

	

// *****************************************
// This section to do with button management 
// *****************************************
	
// for individual View Results Buttons in Current Studies Table
$("#viewGoesHere").on( "click", "#currentStudiesTable a[name='viewResults']", function(event){
    var studyID = this.id.slice(8);
    console.log("going to view results");
    console.log("studyID = " + studyID);
    viewResults(studyID);

});

// for individual Manage Community Buttons in Current Studies Table
$("#viewGoesHere").on( "click", "#currentStudiesTable a[name='communityPosts']", function(event){
    var studyID = this.id.slice(6);
    console.log("going to monitor a community");
    console.log("studyID = " + studyID);
    //var conditionGroup = "1";
    //var phase = "2";
    viewCommunityPosts(studyID);
    //alert("NOT IMPLEMENTED");
});


$("#viewGoesHere").on("click", "#cgCheckAll", function (event) {
    var temp = this.className;
    console.log(temp);
    var studyID = temp.slice(8);
    console.log("cg All: " + studyID);
    $(".checkCG-"+studyID).prop('checked', $(this).prop('checked'));
}); 

$("#viewGoesHere").on("click", "#phaseCheckAll", function (event) {
    var temp = this.className;
    var studyID = temp.slice(11);
    console.log("phase All: " + studyID);
    $(".checkPhase-"+studyID).prop('checked', $(this).prop('checked'));
});


// ****************************************
// This section to do with View Results 
// ****************************************

$("#viewGoesHere").on( "click", "#select-form button[name='submitParameters']", function(event){
    var studyID = this.id;
    //console.log("going to load diagram");
   // console.log("studyID = " + studyID);
    event.preventDefault();

    var dataFormatInput = $("input[name=dataFormat]:checked");
    var dataChoiceInput = $("input[name=dataChoice]:checked");
    var dataChoice = dataChoiceInput.attr('id'); //get which type of data
    var dataFormat = dataFormatInput.attr('id'); 
    var selectedConditionGroups = [];
    var selectedPhases = [];

    // create a common controller
    var dataQuery = {q: "get_results", studyID: studyID}; //conditionGroupArray: selectedConditionGroups, phaseArray: selectedPhases,


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



    if(selectedConditionGroups.length == 0 || selectedPhases.length == 0) {
        alert("Please select at least one condition group and/or phase");
    } else {
        //dataQuery['conditionGroupArray'] = selectedConditionGroups;
        //dataQuery['phaseArray'] = selectedPhases;

        // get all of the data from a study
        formatData(dataQuery, selectedConditionGroups, selectedPhases, dataFormat, dataChoice);



    }

    // get the checked boxes

    //console.log(dataID);
    console.log(selectedConditionGroups);
    console.log(selectedPhases);
    console.log(dataFormat);
    console.log(dataChoice);
    //alert("Getting view");
});
	
	
function viewResults(studyID){
   // var controller = "server/admin-monitor-studies-ctr.php";
    var singleStudyQuery = { q: "get_single_study_data", studyID: studyID};
    console.log("getting view results"+studyID);

    document.getElementById("infoGoesHere-"+studyID).innerHTML = "";
    // append initial html not dependent on study
    $("#infoGoesHere-"+studyID).append(
            "<h3>Select Parameters</h3>"+
            "<form class='form-inline' id='select-form'>"+
                "<div class='form-group col-sm-3'>"+
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
                "<div class='form-group col-sm-3' id='data'>"+
                    "<h4>Data Content</h4>"+
                    "<div class='form-check'>"+
                        "<label class='form-check-label'>"+
                            "<input class='form-check-input' type='radio' name='dataChoice' id='energy' checked>"+
                                "Energy"+
                            "</label>"+
                    "</div>"+   
                    "<div class='form-check'>"+ 
                        "<label class='form-check-label'>"+
                            "<input class='form-check-input' type='radio' name='dataChoice' id='posts'>"+
                                "Posts"+
                        "</label>"+
                    "</div>"+
                    "<div class='form-check'>"+ 
                        "<label class='form-check-label'>"+                     
                            "<input class='form-check-input' type='radio' name='dataChoice' id='numLikes'>"+
                            "Number of likes"+
                        "</label>"+
                    "</div>"+                                                                                         
                "</div>"+ 
                "<div class='form-group col-sm-3' id='format'>"+
                    "<h4>Data Format</h4>"+
                    "<div class='form-check'>"+
                        "<label class='form-check-label'>"+
                            "<input class='form-check-input' type='radio' name='dataFormat' id='lineChart' checked>"+
                                "Line Chart"+
                            "</label>"+
                    "</div>"+   
                    "<div class='form-check'>"+ 
                        "<label class='form-check-label'>"+
                            "<input class='form-check-input' type='radio' name='dataFormat' id='barGraph'>"+
                                "Bar Graph"+
                        "</label>"+
                    "</div>"+
                    "<div class='form-check'>"+ 
                        "<label class='form-check-label'>"+                     
                            "<input class='form-check-input' type='radio' name='dataFormat' id='tableOfData'>"+
                            "Table"+
                        "</label>"+
                    "</div>"+ 
                "</div>"+       
                "<div class='form-group col-sm-offset-4'>"+
                    "<button type='submit' class='btn btn-primary' id="+studyID+" name='submitParameters'>Get Data</button>"+
                "</div>"+                          
            "</form>"+
            "<div class='row col-sm-12' id='dataSpace'>"+

            "</div>"
    );

    $.getJSON(monitorStudiesController, singleStudyQuery, function(result) {
        if (!result.error) {
            // html injection
            console.log("successful get");
            console.log(result.data.conditionGroups);

            for(var cNum = 0; cNum < result.data.conditionGroups; cNum++){
                console.log("filling in cg "+(cNum+1));
                $("#conditionGroups-"+studyID).append(
                    "<div class='checkbox'>"+
                        "<label><input type='checkbox' class='checkCG-"+studyID+"' name='cgCheck' id='"+(cNum+1)+"'>Condition Group "+(cNum+1)+
                        "</label>"+
                    "</div>"  
                );
            }

            for(var pNum = 0; pNum < result.data.phases; pNum++){
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


function formatData(dataQuery, selectedConditionGroups, selectedPhases, dataFormat, dataChoice) {
    var data = [];

    $.getJSON(monitorStudiesController, dataQuery, function(result) {
        console.log(result.data[0]);
        for (var i = 0; i < result.data.length; i++) {
            if(selectedConditionGroups.indexOf(result.data[i].conditionGroupNum) != -1 &&
                selectedPhases.indexOf(result.data[i].phaseNum) != -1){
                console.log(result.data[i]);
                data.push(result.data[i]);
            }
        }
        console.log(data[0]);
/*        $.each(result, function(index, entryRecord){
            console.log("current entry record "+entryRecord.data);
            if(entryRecord.conditionGroupNum.indexOf(selectedConditionGroups) != -1 &&
                entryRecord.phaseNum.indexOf(selectedPhases) != -1){
                console.log("entry record pushed: "+entryRecord);
                data.push(entryRecord);
            }
        });*/

        if (dataChoice == 'energy'){
            displayEnergyData(data, dataFormat, selectedConditionGroups);
        } else {
            alert("Not IMPLEMENTED");
        }
    });

}

function displayEnergyData(data, dataFormat, selectedConditionGroups) { // data is an array, dataFormat is a string

    // Load the Visualization API and the corechart package.
    google.charts.load('visualization', '1', {'packages':['corechart', 'controls']});

    // Set a callback to run when the Google Visualization API is loaded.
    console.log("data: "+data);
    document.getElementById("dataSpace").innerHTML = "";

    if(dataFormat == 'lineChart') {
        $("#dataSpace").append(
            "<div id='dashboard'>"+
                "<strong>Use the slider control</strong>"+
                "<div id='control'>"+
                    "<h4>HELLO</h4>"+
                "</div>"+
                "<div class='chart' id='trendChart'>"+
                    "<h4>HELLO2</h4>"+
                "</div>"+
            "</div>"
        );
        google.charts.setOnLoadCallback(createChart);
        console.log('line chart');
        function createChart() { // need to figure out multi-series
            // prepare data for line chart
            console.log("create chart");
            var lineChartArray = new google.visualization.DataTable();
            lineChartArray.addColumn('date', 'Date'); // x-axis

            for (var i = 0; i < selectedConditionGroups.length; i++){
                lineChartArray.addColumn('number', 'conditionGroup '+selectedConditionGroups[i]);
            }

            var partialArray = []; // keep track of date and each CG's energy
            var cgArray = []; // keep track of CGs in partial array
            //console.log("line chart array "+lineChartArray);
            console.log("data length: "+data.length);
            console.log("selected cg array: "+selectedConditionGroups.length);

            // need to fix: not looping for some reason
            for (var i = 0; i < data.length; i++) { // cycle through all the entries in the study
                partialArray[0] = data[i].entryDate; // append the entry's date
                console.log("partialArray: "+partialArray[0]);
                for (var j = 0; j < selectedConditionGroups.length; j++) { // cycle through the selected CGs
                    console.log("top of inner loop: j-index: "+j+" i-index: "+i);
                    if(selectedConditionGroups[j] == data[i].conditionGroupNum && 
                        cgArray.indexOf(selectedConditionGroups[j]) != -1){ // selected == data entry CG and is already in cgArray
                            // add the energy to existing entry
                        console.log("add existing energy j-index: "+j+" i-index: "+i);
                            partialArray[cgArray.indexOf(selectedConditionGroups[j]) + 1] += (data[i].endEnergy - data[i].startEnergy);
                    } else if (selectedConditionGroups[j] == data[i].conditionGroupNum) { // not in partialArray
                        // add it along with energy
                        console.log("add new entryj-index: "+j+" i-index: "+i);
                        cgArray.push(selectedConditionGroups[j]);
                        partialArray.push((data[i].endEnergy - data[i].startEnergy));
                    } else {
                        console.log("break out: j-index: "+j+" i-index: "+i);
                        //break;
                    }
                }
                console.log("partial Array");
                console.log(partialArray);
                lineChartArray.addRows([partialArray]);
                console.log("After insert: "+lineChart);
                partialArray = [];
                cgArray = [];
            }
            
            console.log("energy array: ");
            console.log(lineChartArray);

            var dash_container = document.getElementById('dashboard'),
                myDashboard = new google.visualization.Dashboard(dash_container);
                var myDateSlider = new google.visualization.ControlWrapper({
                'controlType': 'ChartRangeFilter',
                'containerId': 'control',
                'options': {
                    'filterColumnLabel': 'Date'
                }
            });

            var trendLine = new google.visualization.ChartWrapper({
                chartType: 'Line',
                containerId: 'trendChart',
                options: {
                    title: 'Energy consumption per day (kWh) by Condition Group',
                    vAxis: {
                        'title': "Energy (kWh)"
                    }
                }
            });

            myDashboard.bind(myDateSlider, trendLine);  
            
            // Set chart options
            var options = {                           
                height: 300,
                title: 'Energy consumption per day',
                subtitle: 'in KWs inputted',
                legend: { position: 'none' },
                enableInteractivity: false,
                
                vAxis: {
                  'title': "Energy (kWh)"
                }
            };

            myDashboard.draw(lineChartArray, options);
        } // end createChart
    } else if (dataFormat == 'barGraph') {
            // prepare data for bar chart
        var table = [['Condition Group', 'Energy(kWh)']];
        /*var dataString = JSON.parse(data);
        var cgDailyEntryArray = $.map(dataString, function(el) {
            return el;
        });*/
        $.each(data, function(key, entry) {
            for (var i = 0; i < table.length; i++) {
                if(table[i][0] == entry.conditionGroupNum){
                    table[i][1] += (entry.endEnergy - entry.startEnergy);
                    break;
                } else if(i == table.length - 1) {
                    // condition group not in table, so add it
                    table.push([parseInt(entry.conditionGroupNum), parseInt((entry.endEnergy - entry.startEnergy))]);                
                }
            }        
        });
        console.log("table: ");
        console.log(table);

        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
           var data = new google.visualization.arrayToDataTable(table);

            // Set chart options
            var options = {
               
                    width: 600,
                    height: 300
               
            };
            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.BarChart(document.getElementById('dataSpace'));
            chart.draw(data, options);
        
        } // end drawChart
    } else {
        alert("NOT YET IMPLEMENTED");
    }
}


function generateBarGraph(dataQuery, dataChoice) {
    // bar graph
    alert("NOT IMPLEMENTED bar graph");
}

function generateTableOfData(dataQuery, dataChoice) {
    // dataTable
    alert("NOT IMPLEMENTED table of data");
}

/*function convertArrayToTable(arr) {
    console.log("convertArrayToTable");
    //var array = [['Date', 'TotalEnergy']];
    var array = new google.visualization.DataTable();
    array.addColumn('number', 'conditionGroup');
    array.addColumn('date', 'Date'); // x-axis
    array.addColumn('number', "Energy (kWh)"); // y-axis

    //console.log(array);
    //console.log(arr["DailyEntries"]);
    $.each(arr.DailyEntries, function(key, entry){
        var tDate = entry.date.split(/[-]/);
        var sDate = new Date(tDate[0], tDate[1]-1, tDate[2]);
        //var strDate = sDate.toDateString().slice(3);
        //console.log("hit: "+entry);
        array.addRows([
                        [entry.conditionGroupNum, sDate, (entry.endEnergy - entry.startEnergy)]
        ]);
    });
    console.log("table data:");
    console.log(array);
    return array;
}*/

// ****************************************
// This section to do with Community Posts 
// ****************************************


function viewCommunityPosts(studyID) {
   // var controller = "server/admin-monitor-studies-ctr.php";
    var communityQuery = { q: "get_study_data",
                            studyID: studyID
                        };



    $.getJSON(monitorStudiesController, communityQuery, function(result) {
        console.log(JSON.stringify(result));
        //alert(result);
        var studyArray = result.studies;
        var conditionGroupPhaseArray = result.conditionGroupPhase;
        var postsArray = result.posts;
        
        if (!result.error) {
            // html injection
            console.log("successful get");
/*            var studyData = result.data[0];
            var numConditionGroups = studyData.conditionGroups;
            var numPhases = studyData.phases;*/
console.log("community posts for study:"+studyID);
//            $.each(studyArray, function(index, studyRecord){
                document.getElementById("infoGoesHere-"+studyID).innerHTML = "";
                console.log("insert html");
                $("#infoGoesHere-"+studyID).append(
                    "<form id='postForm"+studyID+"' class='form-horizontal' role='form'>"+
                        "<div id='studyPostContent" + studyID + "'>" + 
                            "<div class='container col-sm-offset-1 col-sm-10 panel-body'>" +      
                                monitorConditionGroupPhaseTabs(studyID, conditionGroupPhaseArray, postsArray)+
                            "</div>"+
                        "</div>" +
                    "</form>"
                );
//            });
            
        }
        else {
                // no posts but still want to show tabs
                document.getElementById("infoGoesHere-"+studyID).innerHTML = "";
                $("#infoGoesHere-"+studyID).append(
                    "<form id='postForm"+studyID+"' class='form-horizontal' role='form'>"+
                        "<div id='studyPostContent" + studyID + "'>" + 
                            "<div class='container col-sm-offset-1 col-sm-10 panel-body'>" +      
                                monitorConditionGroupPhaseTabs(studyID, conditionGroupPhaseArray, postsArray)+
                            "</div>"+
                        "</div>" +
                    "</form>"
                );
            console.log(result.errorMsg);
        }


    });
} 

$("#viewGoesHere").on("click", "#currentStudiesTable ul.nav-tabs a", function(e) {
    e.preventDefault();
    $(this).tab('show');
});

function monitorConditionGroupPhaseTabs(studyID, conditionGroupPhaseArray, postsArray) {
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
                tabStr += "             <div class='form-group'>";
                tabStr += "                 <label for='post-input-"+phR.studyID+"'>Compose a post!</label>";
                tabStr += "                 <textarea class='form-control' id='post-input-"+phR.studyID+"-"+cgR.conditionGroupNum+"-"+phR.phaseNum+"' rows='3'></textarea>";
                tabStr += "             </div>";
                tabStr += "             <div class='form-group'>";
                tabStr += "                 <a href=# class='btn btn-default' id='post-submit-"+phR.studyID+"-"+cgR.conditionGroupNum+"-"+phR.phaseNum+"' name='admin-post-form'>"; //onclick='submitPost("+phR.studyID+","+cgR.conditionGroupNum+","+phR.phaseNum+")'
                tabStr += "                      Submit to Community Posts</a>";
                tabStr += "              </div>";
                tabStr += displayPost(phR.studyID, cgR.conditionGroupNum, phR.phaseNum, postsArray);
                tabStr += "</div>";
                firstFoundPh = true;
            }
            else {
                tabStr += "<div class='tab-pane' id='study" + phR.studyID + "Condition" + cgR.conditionGroupNum + "Phase" + phR.phaseNum + "'>";  
                tabStr += "             <div class='form-group'>";
                tabStr += "                 <label for='post-input-"+phR.studyID+"'>Compose a post!</label>";
                tabStr += "                 <textarea class='form-control' id='post-input-"+phR.studyID+"-"+cgR.conditionGroupNum+"-"+phR.phaseNum+"' rows='3'></textarea>";
                tabStr += "             </div>";
                tabStr += "             <div class='form-group'>";
                tabStr += "                 <a href=# class='btn btn-default' id='post-submit-"+phR.studyID+"-"+cgR.conditionGroupNum+"-"+phR.phaseNum+"' name='admin-post-form'>"; //onclick='submitPost("+phR.studyID+","+cgR.conditionGroupNum+","+phR.phaseNum+")'
                tabStr += "                      Submit to Community Posts</a>";
                tabStr += "              </div>";
                tabStr += displayPost(phR.studyID, cgR.conditionGroupNum, phR.phaseNum, postsArray);
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

    console.log("done insert");
    console.log(tabStr);
    
    return tabStr;
} 

// currently breaks create study page
// TODO - get rid of studyID parameter
function displayPost(studyID, cg, ph, postsArray) {
 //   var controller = "server/admin-monitor-studies-ctr.php";
 //   var postQuery = {q: "get_posts", studyID: studyID, conditionGroup: cg, phaseNum: ph };
    var post = "";
    var noPosts = true;
console.log("cg: "+ cg + " ph: " + ph);
 /*    $.getJSON(monitorStudiesController, postQuery, function(result) {
        if (!result.error) {
            // html injection
            console.log("successful get");
            //console.log(result);
            var postsArray = $.map(result.data, function(el){
                return el;
            });

 */            // sort by date
 
            postsArray.sort(function(postA, postB){
                return postA.dateTimeStamp - postB.dateTimeStamp;
            });

            post += "<div class='panel panel-primary'>";
            post +=     "<div class='panel-heading; id='outer'>Latest Posts</div>";
            post +=     "<div class='panel-body'>";
            post +=         "<div class='panel-group id='accordion'>";
            
            $.each(postsArray, function(key, postData){
console.log(postData);            
                // skips record if the condition group and phase does not match the TAB we are currently
                // working on
                if (cg != postData["conditionGroupNum"] ||  ph != postData["phaseNum"])
                    return true;
                noPosts = false;
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
                    post +=             "</div>";

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
                    post +=             "</div>";
                }

            }); // end each
            
            // TODO - better message
            if (noPosts) {
                post += "<p>No Posts</p>";
            }
/*         } // end if
        else {
            console.log(result.errorMsg);
        }
 */
        post +=            "</div> <!--End panel-group-->";
        post +=         "</div> <!--end panel-body-->";
        post +=       "</div> <!--end panel primary-->"; //20
        //console.log(post);
        //

        //$("#infoGoesHere-"+studyID).append(post);
       // $("#"+studyID+"-condition"+cg+"Phase"+ph).append(post);
//    });
    console.log("out of get");
   
    return post;
}

function deletePost(postID) {
   // var controller = "server/admin-monitor-studies-ctr.php";

    var checkstr = confirm('Are you sure you want to delete this post?');
    if(checkstr == true) {
        // make DELETE request to server
        $.ajax({
            url: monitorStudiesController + '?' + $.param({"postID": postID}),
            type: 'DELETE',
            success: function(result, textStatus, xhr) {
                console.log(result);
                var data = result;
                console.log('errorMsg='+data.errorMsg);
                if (data.error)
                    alert(data.errorMsg);
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

// currently doesn't create new post, despite the info being passed
$("#viewGoesHere").on("click", "#currentStudiesTable a[name='admin-post-form']", function(){
    boxID = this.id.slice(12).split("-");
    var studyID = boxID[0];
    var conditionGroup =  boxID[1];
    var phase = boxID[2];
    var text = $("#post-input-"+studyID+"-"+conditionGroup+"-"+phase).val();
    var dateTimeStamp = Date();
    var image = null;


    console.log("studyID: "+studyID+", condition group: "+conditionGroup+", phase: "+phase);
    console.log(text);

    $.ajax({
        url: monitorStudiesController,
        type: 'POST',
        data: {dateTime1: dateTimeStamp, text1: text, image1: image, conditionGroupNum1: conditionGroup, phaseNum1: phase, studyID1: studyID},
        dataType: 'json',
        success: function (result, status) {
            console.log('errorMsg='+result.errorMsg);
            console.log(JSON.stringify(result));

            if(result.error){
                alert(result.errorMsg);
            } else {
                alert("New post made!");
                // see if can do a soft refresh to get updated posts
            }
        }, 
        error: function(jqXHR, exception){
            console.log(jqXHR);
            console.log(exception);
            //console.log(xhr);
            console.log("Something went wrong");
        }
    });
    return false; // ajax used, block the normal submit
});