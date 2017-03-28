// jQuery functions for user stats page

// removed content here
$(document).ready(function(){
});

function loadUserStatisticsView() {

    $(".nav li").removeClass("active");
    $(".nav li #statistics").addClass("active");

//  var data_file = "adminhome.json"; // path to temp json file
    var controller = "server/user-statistics-ctr.php"
    var userDailyEntry = { q: "daily_entries_user"};
    var cgDailyEntry = {q: "daily_entries_condition_group", conditionGroupNum: "", studyID: ""};
   // var cgUserDailyEntry = {q: "users_in_condition_group", conditionGroupNum: ""};
    var view = "views/user-statistics-view.html";
    
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            $.getJSON(controller, userDailyEntry, function(userDailyEntryString){
                console.log("statistics info: "+ JSON.stringify(userDailyEntryString.data));
                loadPersonalStatistics(userDailyEntryString);
                cgDailyEntry["conditionGroupNum"] = userDailyEntryString.data[0]["conditionGroupNum"];

                cgDailyEntry["studyID"] = localStorage.getItem("studyID");
                $.getJSON(controller, cgDailyEntry, function(cgDailyEntryString){
                    loadConditionGroupStatistics(cgDailyEntryString);
                    loadSubTeamStatistics(cgDailyEntryString); 
                });
            });
        }
    });
} // end function

function loadPersonalStatistics(userDailyEntryString){

     $("#past-entries").append(
        "<div class='table-responsive'>"+          
          "<table class='table' id='entryTable'>"+
            "<thead>"+
              "<tr>"+
                "<th>Start Energy</th>"+
                "<th>End Energy</th>"+
                "<th>Date</th>"+
             "</tr>"+
            "</thead>"+
            "<tbody id='entries'>"+
            "</tbody>"+
          "</table>"+
      "</div>");

    var personalDailyEntryArray = $.map(userDailyEntryString.data, function(el) {
        return el;
    });

    $.each(personalDailyEntryArray, function(key, entry){
        console.log(JSON.stringify(entry));
        var tDate = entry.entryDate.split(/[-]/);
        var sDate = new Date(Date.UTC(tDate[0], tDate[1]-1, tDate[2]));
        var strDate = sDate.toDateString().slice(3);
        console.log("adding personal entries");
        $("#entries").append(
            "<tr>"+
                "<td>"+entry.startEnergy+"</td>"+
                "<td>"+entry.endEnergy+"</td>"+
                "<td>"+strDate+"</td>"+
            "</tr>");
    });    

    $('#entryTable').dataTable({
        "iDisplayLength": 5,
        "bLengthChange": false,
        "bFilter": false
        
    });


    // Load the Visualization API and the corechart package.
    google.charts.load('visualization', '1', {'packages':['corechart', 'controls']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(createChart);

    // Callback that creates and populates a data table,
    // instantiates the chart, passes in the data and
    // draws it.
    function createChart() {

       //var jsonData = '';
       //console.log(result);
       

        var userDailyEntryArray = convertToPersonalTable(userDailyEntryString);
        //var data = new google.visualization.arrayToDataTable(userDailyEntryArray);
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
                title: 'Energy consumption per day (kWh)',
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
                vAxis: {
                  'title': "Energy (kWh)"
                }
        };

        myDashboard.draw(userDailyEntryArray, options);       
      } // end drawChart

    $(window).resize(function(){
        createChart();
    });
} // end loadPersonalStatistics

function convertToPersonalTable(arr) {
    var array = new google.visualization.DataTable();
    array.addColumn('date', 'Date');
    array.addColumn('number', "Energy (kWh)");
    $.each(arr.data, function(key, entry){
        var tDate = entry.entryDate.split(/[-]/);
        var sDate = new Date(tDate[0], tDate[1]-1, tDate[2]);
        array.addRows([
                        [sDate, (entry.endEnergy - entry.startEnergy)]
        ]);
    });
    return array;
}

function loadConditionGroupStatistics(cgDailyEntryString) {
    var cgDailyEntryArray = convertToCGArray(cgDailyEntryString);

    // put into a table
     $("#ranking").append(
        "<div class='table-responsive'>"+          
          "<table class='table' id='rankTable'>"+
            "<thead>"+
              "<tr>"+
                "<th>Rank</th>"+
                "<th>Username</th>"+
             "</tr>"+
            "</thead>"+
            "<tbody id='ranks'>"+
            "</tbody>"+
          "</table>"+
      "</div>");

     for(var i = 0; i < cgDailyEntryArray.length; i++) {
        $("#ranks").append(
            "<tr>"+
                "<td>"+(i+1)+"</td>"+
                "<td>"+cgDailyEntryArray[i][0]+"</td>"+
            "</tr>"
        );
     }

    $('#rankTable').dataTable({
        "iDisplayLength": 5,
        "bLengthChange": false,
        "bFilter": false
    });        
}

function loadSubTeamStatistics(cgDailyEntryString) {
    var table = subTeamArrayFormat(cgDailyEntryString);

    console.log("sub team table");
    console.log(table);

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        console.log("drawChart");
       //var jsonData = '';
       //console.log(result);
        //var userDailyEntryArray = convertToPersonalTable(userDailyEntryString);


        var data = new google.visualization.arrayToDataTable(table);

        // Set chart options
        var options = {
           
            height: 300,
            title: 'Energy Consumption per Team', 
            legend: { position: 'none' },            
            vAxis: {
              'title': "Sub-Teams"
            }
        };


        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById('subTeamChart'));
        chart.draw(data, options);
        
    } // end drawChart

    $(window).resize(function(){
        drawChart();
    });
}

function convertToCGArray(cgDailyEntryString){
    var cgDailyEntryArray = $.map(cgDailyEntryString.data, function(el) {
        return el;
    });

    var userEnergy = [];
    var uniqueUsers = [];
    for(var i = 0; i < cgDailyEntryArray.length; i++){
        if (uniqueUsers.indexOf(cgDailyEntryArray[i].userName) != -1 ) {
            continue;
        }

        uniqueUsers.push(cgDailyEntryArray[i].userName);
    }

    console.log("as an array");
    console.log(cgDailyEntryArray);

    // add up user's total energys then sort

    for (var i = 0; i < uniqueUsers.length; i++) {
        userEnergy.push([uniqueUsers[i], 0]);
    }

    for (var k = 0; k < cgDailyEntryArray.length; k++) {
        for(var i = 0; i < userEnergy.length; i++) {
            if(userEnergy[i][0] == cgDailyEntryArray[k].userName) {
                userEnergy[i][1] += (parseInt(cgDailyEntryArray[k].endEnergy) - parseInt(cgDailyEntryArray[k].startEnergy));
            }
        }
    }

    userEnergy.sort(function(a, b){
        console.log("sorting...");
        var userA = a[1].endEnergy - a[1].startEnergy;
        var userB = b[1].endEnergy - b[1].startEnergy;
        return userA - userB;
    });

    return userEnergy;
}

function subTeamArrayFormat(cgDailyEntryString){
    var cgDailyEntryArray = $.map(cgDailyEntryString.data, function(el) {
        return el;
    });

    var teamEnergy = [['Sub-team', 'Energy (kWh)']];
    var uniqueTeams = [];
    for(var i = 0; i < cgDailyEntryArray.length; i++){
        if (uniqueTeams.indexOf(cgDailyEntryArray[i].teamNumber) != -1 ) {
            continue;
        }

        uniqueTeams.push(cgDailyEntryArray[i].teamNumber);
    }

    console.log("as an array");
    console.log(cgDailyEntryArray);

    // add up user's total energys then sort

    for (var i = 0; i < uniqueTeams.length; i++) {
        teamEnergy.push([uniqueTeams[i], 0]);
    }

    for (var k = 0; k < cgDailyEntryArray.length; k++) {
        for(var i = 0; i < teamEnergy.length; i++) {
            if(teamEnergy[i][0] == cgDailyEntryArray[k].teamNumber) {
                teamEnergy[i][1] += (parseInt(cgDailyEntryArray[k].endEnergy) - parseInt(cgDailyEntryArray[k].startEnergy));
            }
        }
    }

/*    teamEnergy.sort(function(a, b){
        console.log("sorting...");
        var userA = a[1].endEnergy - a[1].startEnergy;
        var userB = b[1].endEnergy - b[1].startEnergy;
        return userA - userB;
    });*/
console.log(JSON.stringify(teamEnergy));
    return teamEnergy;
}

