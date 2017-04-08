// jQuery functions for admin home page
// TODO: check go-to specific study on manage studies works 

// go to content div and shove some stuff in
$(document).ready(function() {
}); // end function

function getTimeNow() {

    var today = new Date();
    var hh = today.getHours();
    var nn = today.getMinutes();
    var ss = today.getSeconds();
    
    if(hh<10){hh='0'+hh} 
    if(nn<10){nn='0'+nn} 
    if(ss<10){ss='0'+ss} 
    return hh+':'+nn+':'+ss;
}

function getDateNow() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        
        if(dd<10){dd='0'+dd} 
        if(mm<10){mm='0'+mm} 
        return yyyy+'-'+mm+'-'+dd;
}

// load incomplete entries
function loadUserInputDataIncomplete() {

    var view = "views/user-input-data-view.html";
    var controller = "server/user-input-data-ctr.php";
    // need controller data, but the data here is not used in this case
    var ctrData = { q: "example", otherVar: "someOtherExample" };

    $(".nav li").removeClass("active");
    $("#inputData").addClass("active");
    // clear contents first
    document.getElementById("viewGoesHere").innerHTML = ""
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){

        today = getDateNow();
        todayTime = getTimeNow();
        $('#entry-date-input').attr('value', today);    
        $('#start-time-input').attr('value', todayTime);    
        $('#end-time-input').attr('value', todayTime);    
    
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            
            $.getJSON(controller, ctrData, function(result) {
                var incompleteEntryArray = result.data; // getStudies();
                //console.log("result=" + JSON.stringify(result.data)); 

                renderIncompleteEntries(incompleteEntryArray, todayTime);
            }); // end get
        } // end if
    });
} // end function


function renderIncompleteEntries(incompleteEntryArray, todayTime) {
    $.each(incompleteEntryArray, function(key, entry) {
        $("#input-mid").append("<div id='"+entry.entryID+"'>"+
            "<form class='form-horizontal' id='form-"+entry.entryID+"'>"+
                "<div class='form-group'>"+
                    "<label class='control-label col-sm-2' for='entry-date-incomplete-"+entry.entryID+"'>Date</label>"+
                    "<div class='col-sm-3'>"+
                        "<input class='form-control' type='date' id='entry-date-incomplete-"+entry.entryID+"' value=''>"+
                    "</div>"+
                "</div>"+

                "<div class='form-group'>"+
                    "<label class='control-label col-sm-2' for='start-time-incomplete-"+entry.entryID+"'>Start Time</label>"+
                    "<div class='col-sm-3'>"+
                        "<input class='form-control' type='time' id='start-time-incomplete-"+entry.entryID+"' value='00:00:00'>"+
                    "</div>"+

                    "<label class='control-label col-sm-2' for='start-energy-incomplete-"+entry.entryID+"'>Start Energy (kWH)</label>"+
                    "<div class='col-sm-3'>"+
                        "<input class='form-control' type='number' step='0.01' id='start-energy-incomplete-"+entry.entryID+"'>"+
                    "</div>"+
                "</div>"+
                "<div class='form-group'>"+
                    "<label class='control-label col-sm-2' for='end-time-incomplete-"+entry.entryID+"'>End Time</label>"+
                    "<div class='col-sm-3'>"+
                        "<input class='form-control' type='time' id='end-time-incomplete-"+entry.entryID+"' value='00:00:00'>"+
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
        $('#end-time-incomplete-'+entry.entryID).attr('value', todayTime);    
    }); // end each    
}


$("#viewGoesHere").on( "click", "#input-mid :submit", function(){
    var controller = "server/user-input-data-ctr.php";
    var ctrData = { q: "example", otherVar: "someOtherExample" };

    //Get the id of this clicked item
    entryID = this.id;
    
    //console.log("hello6");
    var entryDate = $("#entry-date-incomplete-"+entryID).val();
    var startTime = $("#start-time-incomplete-"+entryID).val();
    var startEnergy = $("#start-energy-incomplete-"+entryID).val();
    var endTime = $("#end-time-incomplete-"+entryID).val();
    var endEnergy = $("#end-energy-incomplete-"+entryID).val();

    // Stop form from submitting normally
    event.preventDefault();
    // check input field
    if (endEnergy == null || endEnergy <= 0 || isNaN(parseFloat(endEnergy))) 
        alert("Please enter end energy!");
    else if (parseFloat(startEnergy) >= parseFloat(endEnergy)) 
        alert("Please enter end energy that is greater than start energy");
    else {
        $.ajax({
            url: 'server/user-input-data-ctr.php',
            type: 'PUT',
            dataType: 'text',
            contentType: 'application/json; charset=utf-8',
            data: {entryID1: entryID, entryDate1: entryDate, startTime1: startTime, 
                    startEnergy1: startEnergy, endTime1: endTime, endEnergy1: endEnergy},
            success: function(result) {
                //console.log(result);
                var data = jQuery.parseJSON(result);

                if(data.error){
                    alert(data.errorMsg);
                } else {
                    
                    $.getJSON(controller, ctrData, function(result) {
                        var incompleteEntryArray = result.data;
                        //console.log("result=" + JSON.stringify(result.data)); 

                        // clear incomplete entries list and re-render
                        $("#input-mid").empty();
                        renderIncompleteEntries(incompleteEntryArray, getTimeNow());
                    }); // end get
                } 
            },
            error: function(jqXHR, exception){
/*                console.log(jqXHR);
                console.log(exception);*/
                //console.log(xhr);
                console.log("Something went wrong");
            }
        }); // end ajax
    }
}); // end click


$("#viewGoesHere").on( "click", "#input-submit", function(event){
  //  console.log("submitting");
    var controller = "server/user-input-data-ctr.php";
    var ctrData = { q: "example", otherVar: "someOtherExample" };
    
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

   // console.log("teamNumber: "+teamNumber);
    event.preventDefault();

    if(entryDate == null || startTime == null || endTime == null) {
        alert("Please fill in date, start time, end time!");
    }
    else if(startEnergy == null || startEnergy <= 0 || isNaN(parseFloat(startEnergy)) || endEnergy == null) {
        alert("Please fill in an non zero start energy and an end energy (0 allowed)!");
    } 
    else {
        $.ajax({
            url: "server/user-input-data-ctr.php",
            type: 'POST',
            data: {entryDate1: entryDate, startTime1: startTime, startEnergy1: startEnergy,
                    endTime1: endTime, endEnergy1: endEnergy, CurrentConditionGroup1: CurrentConditionGroup,
                    currentPhase1: currentPhase, studyID1: studyID, teamNumber1: teamNumber},
            dataType: 'json',
            success: function (result, status) {
               /* console.log('errorMsg='+result.errorMsg);
                console.log(JSON.stringify(result));*/

                if(result.error){
                    alert(result.errorMsg);
                } else {
                    alert("New input made!");
                    
                    $.getJSON(controller, ctrData, function(result) {
                        var incompleteEntryArray = result.data; // getStudies();
                        //console.log("result=" + JSON.stringify(result.data)); 

                        // reset form to current date/time/values
                        today = getDateNow();
                        todayTime = getTimeNow();
                        $('#entry-date-input').attr('value', today);    
                        $('#start-time-input').attr('value', todayTime);    
                        $('#end-time-input').attr('value', todayTime);    
                        $("#start-energy-input").val('0.0');
                        $("#end-energy-input").val('0.0');
                        
                        // clear incomplete entries list and re-render
                        $("#input-mid").empty();
                        renderIncompleteEntries(incompleteEntryArray, todayTime);
                    }); // end get
                }
            }, 
            error: function(jqXHR, exception){
/*                console.log(jqXHR);
                console.log(exception);*/
                //console.log(xhr);
                console.log("Something went wrong");
            }
        });
    }                
});