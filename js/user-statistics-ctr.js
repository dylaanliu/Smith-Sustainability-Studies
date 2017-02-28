// jQuery functions for user stats page

// removed content here
$(document).ready(function(){
});

function loadUserStatisticsView() {

//	var data_file = "adminhome.json"; // path to temp json file
    var controller = "server/user-statistics-ctr.php"
    var userDailyEntry = { q: "daily_entries_user"};
    var cgDailyEntry = {q: "daily_entries_condition_group", conditionGroupNum: ""};
    var cgUserDailyEntry = {q: "users_in_condition_group", conditionGroupNum: ""};
    var view = "views/user-statistics-view.html";
    
	$("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            //alert("success");
            //console.log("before get");
            $.getJSON(controller, userDailyEntry, function(userDailyEntryString){
                //console.log("hello get1");
                //console.log(result["DailyEntries"]);
                loadPersonalStatistics(userDailyEntryString);
                cgDailyEntry["conditionGroupNum"] = userDailyEntryString["DailyEntries"][0]["conditionGroupNum"];
                //console.log(cgDailyEntry["conditionGroupNum"]);
                console.log("before getting cg stats");
                $.getJSON(controller, cgDailyEntry, function(cgDailyEntryString){
                    console.log("got cg stats");
                    loadConditionGroupStatistics(cgDailyEntryString);
                    loadSubTeamStatistics(cgDailyEntryString);
                });



            });

            //loadPersonalStatistics();
            //loadConditionGroupStatistics();
        }
	});
} // end function

function loadPersonalStatistics(userDailyEntryString){
    
    console.log("hello stats1");




/*    $('#entries-table').DataTable({
        "aaData": userDailyEntryArray,
        "aoColumnDefs":[{
            "sTitle":"Energy",
            "aTargets": ["energy"]
        }]
    });*/

 // put into a table
    var pastEntriesArray = [['Start Energy', 'End Energy', "Date"]];

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

    var personalDailyEntryArray = $.map(userDailyEntryString, function(el) {
        return el;
    });
    $.each(personalDailyEntryArray, function(key, entry){
    console.log("adding personal entries");
       $("#entries").append(
            "<tr>"+
                "<td>"+entry.startEnergy+"</td>"+
                "<td>"+entry.endEnergy+"</td>"+
                "<td>"+entry.date+"</td>"+
            "</tr>");

    });    

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the chart, passes in the data and
    // draws it.
    function drawChart() {

       //var jsonData = '';
       //console.log(result);
       

        var userDailyEntryArray = convertToPersonalTable(userDailyEntryString);
        var data = new google.visualization.arrayToDataTable(userDailyEntryArray);

        // Set chart options
        var options = {
           
                width: 600,
                height: 300,
                title: 'Energy consumption per day',
                subtitle: 'in KWs inputted',
                legend: { position: 'bottom' }
           

        };


        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.LineChart(document.getElementById('trendTable'));
        chart.draw(data, options);
        
      } // end drawChart

} // end loadPersonalStatistics

function convertToPersonalTable(arr) {
    console.log("convertToTable");
    var array = [['Date', 'TotalEnergy']];
    //console.log(array);
    //console.log(arr["DailyEntries"]);
    $.each(arr.DailyEntries, function(key, entry){
        //console.log("hit: "+entry);
        array.push([entry.date, (entry.endEnergy - entry.startEnergy)]);
    });
    //console.log(array);
    return array;
}

function loadConditionGroupStatistics(cgDailyEntryString) {
    console.log("conditionGroup stats");

    var cgDailyEntryArray = convertToCGArray(cgDailyEntryString);
    console.log("after sorting");
    console.log(cgDailyEntryArray);

    // put into a table
    var array = [['Rank', 'Username']];

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
    $.each(cgDailyEntryArray, function(key, user){
        console.log(cgDailyEntryArray.indexOf(user));
       $("#ranks").append(
            "<tr>"+
                "<td>"+(cgDailyEntryArray.indexOf(user) + 1)+"</td>"+
                "<td>"+user.username+"</td>"+
              "</tr>");
              
              

        //array.push([cgDailyEntryArray.indexOf(cgDailyEntryArray.userId), cgDailyEntryArray.username]);
    });

}

function loadSubTeamStatistics(cgDailyEntryString) {
    var cgDailyEntryArray = convertToCGArray(cgDailyEntryString);
    var table = [['Sub-team', 'Energy (kWh)']];

    $.each(cgDailyEntryArray, function(key, entry){
        for (var i = 0; i < table.length; i++) {
            if(table[i][0] == entry.teamNumber){
                table[i][1] += (entry.endEnergy - entry.startEnergy);
                break;
            } else if(i == table.length - 1) {
                // sub team not in table, so add it
                table.push([entry.teamNumber, (entry.endEnergy - entry.startEnergy)]);
                break;
            }
        }
        
    });
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
           
                width: 600,
                height: 300
           

        };


        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById('subTeamTable'));
        chart.draw(data, options);
        
      } // end drawChart
}

function convertToCGArray(cgDailyEntryString){
    var cgDailyEntryArray = $.map(cgDailyEntryString, function(el) {
        return el;
    });

    console.log("as an array");
    console.log(cgDailyEntryArray);
    cgDailyEntryArray.sort(function(a, b){
        console.log("sorting...");
        var userA = a.endEnergy - a.startEnergy;
        var userB = b.endEnergy - b.startEnergy;
        return userA - userB;
    });

    return cgDailyEntryArray;
}