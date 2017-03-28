// jQuery functions for admin home page
// TODO: check go-to specific study on manage studies works 

// go to content div and shove some stuff in
$(document).ready(function() {
}); // end function

/*function fillDateAndTime(){
    $('.entry-date-input').datepicker({ 
     dateFormat: 'dd-mm-yy'
     }).datepicker("setDate", new Date());
    //document.getElementById("entry-date-input").value = Date();
    //document.getElementById('start-time-input').value = Time();
}*/

// load incomplete entries
function loadUserInputDataIncomplete() {

    var view = "views/user-input-data-view.html";
    var controller = "server/user-input-data-ctr.php";
    // need controller data, but the data here is not used in this case
    var ctrData = { q: "example", otherVar: "someOtherExample" };

    $(".nav li").removeClass("active");
    $(".nav li #inputData").addClass("active");
    // clear contents first
    document.getElementById("viewGoesHere").innerHTML = ""
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
           
            $.getJSON(controller, ctrData, function(result) {
                var incompleteEntryArray = result.data; // getStudies();
    console.log("Hello2"); 
    //console.log("result=" + JSON.stringify(result.data)); 


                $.each(incompleteEntryArray, function(key, entry) {
                    console.log("entry: "+JSON.stringify(entry));
                    $("#input-mid").append("<div id='"+entry.entryID+"'>"+
                        "<form class='form-horizontal' id='form-"+entry.entryID+"'>"+
                            "<div class='form-group'>"+
                                "<label class='control-label col-sm-2' for='entry-date-incomplete-"+entry.entryID+"'>Date</label>"+
                                "<div class='col-sm-3'>"+
                                    "<input class='form-control' type='date' id='entry-date-incomplete-"+entry.entryID+"' value=' '>"+
                                "</div>"+
                            "</div>"+

                            "<div class='form-group'>"+
                                "<label class='control-label col-sm-2' for='start-time-incomplete-"+entry.entryID+"'>Start Time</label>"+
                                "<div class='col-sm-3'>"+
                                    "<input class='form-control' type='time' id='start-time-incomplete-"+entry.entryID+"' value=' '>"+
                                "</div>"+

                                "<label class='control-label col-sm-2' for='start-energy-incomplete-"+entry.entryID+"'>Start Energy (kWH)</label>"+
                                "<div class='col-sm-3'>"+
                                    "<input class='form-control' type='number' step='0.01' id='start-energy-incomplete-"+entry.entryID+"'>"+
                                "</div>"+
                            "</div>"+
                            "<div class='form-group'>"+
                                "<label class='control-label col-sm-2' for='end-time-incomplete-"+entry.entryID+"'>End Time</label>"+
                                "<div class='col-sm-3'>"+
                                    "<input class='form-control' type='time' id='end-time-incomplete-"+entry.entryID+"'>"+
                                "</div>"+

                                "<label class='control-label col-sm-2' for='end-energy-incomplete-"+entry.entryID+"'>End Energy (kWH)</label>"+
                                "<div class='col-sm-3'>"+
                                    "<input class='form-control' type='number' step='0.01' id='end-energy-incomplete-"+entry.entryID+"'>"+
                                "</div>"+          
                            "</div>"+
                            "<div class='form-group'>"+
                                "<button type='submit' class='btn btn-default pull-right' id="+entry.entryID+">Save</button>"+
                            "</div>"+
                        "</form>"+
                        "<div class='row'>"+
                            "<div class='col-md-12'>"+
                                "<div class='separator'>"+
                                    "<a href='#'>"+
                                    "</a>"+
                                "</div>"+
                            "</div>"+ 
                        "</div>"+   
                    "</div>");
                    document.getElementById("entry-date-incomplete-"+entry.entryID).value=entry.entryDate;
                    document.getElementById("start-time-incomplete-"+entry.entryID).value=entry.startTime;
                    document.getElementById("start-energy-incomplete-"+entry.entryID).value=entry.startEnergy;
                    document.getElementById("end-time-incomplete-"+entry.entryID).value=entry.endTime;
                    document.getElementById("end-energy-incomplete-"+entry.entryID).value=entry.endEnergy;                    
                    
                    // make inactive if there is data
                    if (entry.entryDate != null){
                        document.getElementById("entry-date-incomplete-"+entry.entryID).disabled = true;
                    }
                    if (entry.startTime != "00:00:00") {
                        document.getElementById("start-time-incomplete-"+entry.entryID).disabled = true;
                    }
                    if (entry.startEnergy != 0) {
                         document.getElementById("start-energy-incomplete-"+entry.entryID).disabled = true;
                    }
                    if (entry.endTime != "00:00:00") {
                        document.getElementById("end-time-incomplete-"+entry.entryID).disabled = true;
                    }
                    if (entry.endEnergy != 0) {
                         document.getElementById("end-energy-incomplete-"+entry.entryID).disabled = true;
                    }                    
                }); // end each
                console.log("hello4");

                // move to function and call it here
                $(":submit").click(function(){
                   //Get the id of this clicked item

                      entryID = this.id;
                      //alert(entryID);
                      $("#form-"+entryID).submit(function(event){
                            console.log("hello6");
                            var entryDate = $("#entry-date-incomplete-"+entryID).val();
                            var startTime = $("#start-time-incomplete-"+entryID).val();
                            var startEnergy = $("#start-energy-incomplete-"+entryID).val();
                            var endTime = $("#end-time-incomplete-"+entryID).val();
                            var endEnergy = $("#end-energy-incomplete-"+entryID).val();

                            // Stop form from submitting normally
                            event.preventDefault();
                            // allowing for blank fields
                            if (endEnergy == '0'){
                                alert("Please enter end energy!");
                            } else {
                                $.ajax({
                                    url: 'server/user-input-data-ctr.php',
                                    type: 'PUT',
                                    dataType: 'text',
                                    contentType: 'application/json; charset=utf-8',
                                    data: {entryID1: entryID, entryDate1: entryDate, startTime1: startTime, 
                                            startEnergy1: startEnergy, endTime1: endTime, endEnergy1: endEnergy},
                                    success: function(result) {
                                        console.log(result);
                                        // Do something with the result
                                        alert("Update made!");
                                    },
                                    error: function(jqXHR, exception){
                                        console.log(jqXHR);
                                        console.log(exception);
                                        //console.log(xhr);
                                        console.log("Something went wrong");
                                    }
                                }); // end ajax
                            }
                        }); // end submit
                }); // end click
            }); // end get

            $("#new-entry").submit(function(event){
                console.log("submitting");
                var entryDate = $("#entry-date-input").val();
                var startTime = $("#start-time-input").val();
                var startEnergy = $("#start-energy-input").val();
                var endTime = $("#end-time-input").val();
                var endEnergy = $("#end-energy-input").val();
                var userID = localStorage.getItem("userID");
                var CurrentConditionGroup = localStorage.getItem("CurrentConditionGroup");
                var currentPhase = localStorage.getItem("currentPhase");
                var studyID = localStorage.getItem("studyID");
                var teamNumber = localStorage.getItem("teamNumber");

                console.log("teamNumber: "+teamNumber);
                event.preventDefault();

                if(entryDate == null || (startTime == null && startEnergy == null) || (endTime == null && endEnergy == null)) {
                    alert("Please fill in date, start time and energy and/or end time and energy!");
                } else {
                    console.log("hello5");
                    $.ajax({
                        url: "server/user-input-data-ctr.php",
                        type: 'POST',
                        data: {entryDate1: entryDate, startTime1: startTime, startEnergy1: startEnergy,
                                endTime1: endTime, endEnergy1: endEnergy, CurrentConditionGroup1: CurrentConditionGroup,
                                currentPhase1: currentPhase, studyID1: studyID, teamNumber1: teamNumber},
                        dataType: 'json',
                        success: function (result, status) {
                            console.log('errorMsg='+result.errorMsg);
                            console.log(JSON.stringify(result));

                            if(result.error){
                                alert(result.errorMsg);
                            } else {
                                alert("New input made!");
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
                }                
            });
        } // end if
    });
} // end function

