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
    console.log(statusTxt); 
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
    console.log("Hello1"); 
           
            $.getJSON(controller, ctrData, function(result) {
                var incompleteEntryArray = result; // getStudies();
    console.log("Hello2"); 
    console.log("result=" + result); 


                $.each(incompleteEntryArray.DailyEntries, function(key, entry) {
                    $("#input-mid").append("<div id='"+entry.entryId+"'>"+
                        "<form class='form-horizontal' id='form-"+entry.entryId+"'>"+
                            "<div class='form-group'>"+
                                "<label class='control-label col-sm-2' for='entry-date-incomplete-"+entry.entryId+"'>Date</label>"+
                                "<div class='col-sm-3'>"+
                                    "<input class='form-control' type='date' id='entry-date-incomplete-"+entry.entryId+"' value=' '>"+
                                "</div>"+
                            "</div>"+

                            "<div class='form-group'>"+
                                "<label class='control-label col-sm-2' for='start-time-incomplete-"+entry.entryId+"'>Start Time</label>"+
                                "<div class='col-sm-3'>"+
                                    "<input class='form-control' type='time' id='start-time-incomplete-"+entry.entryId+"' value=' '>"+
                                "</div>"+

                                "<label class='control-label col-sm-2' for='start-energy-incomplete-"+entry.entryId+"'>Start Energy (kWH)</label>"+
                                "<div class='col-sm-3'>"+
                                    "<input class='form-control' type='number' step='0.01' id='start-energy-incomplete-"+entry.entryId+"'>"+
                                "</div>"+
                            "</div>"+
                            "<div class='form-group'>"+
                                "<label class='control-label col-sm-2' for='end-time-incomplete-"+entry.entryId+"'>End Time</label>"+
                                "<div class='col-sm-3'>"+
                                    "<input class='form-control' type='time' id='end-time-incomplete-"+entry.entryId+"'>"+
                                "</div>"+

                                "<label class='control-label col-sm-2' for='end-energy-incomplete-"+entry.entryId+"'>End Energy (kWH)</label>"+
                                "<div class='col-sm-3'>"+
                                    "<input class='form-control' type='number' step='0.01' id='end-energy-incomplete-"+entry.entryId+"'>"+
                                "</div>"+          
                            "</div>"+
                            "<div class='form-group'>"+
                                "<button type='submit' class='btn btn-default pull-right' id="+entry.entryId+">Save</button>"+
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
                    document.getElementById("entry-date-incomplete-"+entry.entryId).value=entry.date;
                    document.getElementById("start-time-incomplete-"+entry.entryId).value=entry.startTime;
                    document.getElementById("start-energy-incomplete-"+entry.entryId).value=entry.startEnergy;
                    document.getElementById("end-time-incomplete-"+entry.entryId).value=entry.endTime;
                    document.getElementById("end-energy-incomplete-"+entry.entryId).value=entry.endEnergy;                    
                    
                    // make inactive if there is data
                    if (entry.date != null){
                        document.getElementById("entry-date-incomplete-"+entry.entryId).disabled = true;
                    }
                    if (entry.startTime != "00:00:00") {
                        document.getElementById("start-time-incomplete-"+entry.entryId).disabled = true;
                    }
                    if (entry.startEnergy != 0) {
                         document.getElementById("start-energy-incomplete-"+entry.entryId).disabled = true;
                    }
                    if (entry.endTime != "00:00:00") {
                        document.getElementById("end-time-incomplete-"+entry.entryId).disabled = true;
                    }
                    if (entry.endEnergy != 0) {
                         document.getElementById("end-energy-incomplete-"+entry.entryId).disabled = true;
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

                            $.ajax({
                                url: 'server/user-input-data-ctr.php',
                                type: 'PUT',
                                dataType: 'text',
                                contentType: 'application/json; charset=utf-8',
                                data: {entryID1: entryID, entryDate1: entryDate, startTime1: startTime, 
                                        startEnergy1: startEnergy, endTime1: endTime, endEnergy1: endEnergy},
                                success: function(result) {
                                    console.log(result);
                                    console.log("made it!");
                                    // Do something with the result
                                },
                                error: function(jqXHR, exception){
                                    console.log(jqXHR);
                                    console.log(exception);
                                    //console.log(xhr);
                                    console.log("Something went wrong");
                                }

                            }); // end ajax
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
                console.log(userID);
                event.preventDefault();

                if(entryDate == null || (startTime == null && startEnergy == null) || (endTime == null && endEnergy == null)) {
                    alert("Please fill in date, start time and energy and/or end time and energy!");
                } else {
                    console.log("hello5");
                    $.post("server/user-input-data-ctr.php", {entryDate1: entryDate, startTime1: startTime, startEnergy1: startEnergy,
                                        endTime1: endTime, endEnergy1: endEnergy, CurrentConditionGroup1: CurrentConditionGroup,
                                        currentPhase1: currentPhase}, "json")
                    
                    .done(function(responseTxt, statusTxt, xhr){
                        console.log(responseTxt);
                        console.log(statusTxt);
                        console.log(xhr);
                        //$data = jQuery.parseJSON(response);
                        //console.log(response);
                     
                    });
                }

                
            });

        } // end if
    });
} // end function

