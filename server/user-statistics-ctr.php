<?php
// THIS IS JUST A FAKED OUT REST API CONTROLLER ON THE SERVER SIDE. IT IS MISSING A LOT INCLUDING
// AUTHENTICATION and SECURITY (SQLi, XSS, CFRF). IN ADDITION, THERE IS NO SERVER SIDE INPUT VALIDATION.
// OTHER POSSIBLE MISSING FEATURES ARE:
//     No related data (automatic joins) supported
//     No condensed JSON output supported
//     No support for PostgreSQL or SQL Server
//     No POST parameter support
//     No JSONP/CORS cross domain support
//     No base64 binary column support
//     No permission system
//     No search/filter support
//     No pagination or sorting supported
//     No column selection supported
// SEE
// https://www.leaseweb.com/labs/2015/10/creating-a-simple-rest-api-in-php/

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE

// create SQL based on HTTP method
switch ($method) {

  case 'GET':

    // need to check if this exists: ISSET?
    if(!isset($_GET["q"])) {
      htpp_response_code(500);
    }

    $queryType = $_GET["q"]; // don't need userID, as will use $_SESSION
    switch ($queryType) {
      case 'daily_entries_user':
        $userID = "1";                                     // adminID is not required as a parameter. The ID of the user will be from the session and will have to be validated.
                                                                 // It is only provided as an example since u will have to provide parameters from the client to the server in AJAX calls for other controllers    
        $data = getDailyEntries($userID, true);
      error_log(print_r($data, true), 0);
        header('Content-type: application/json');
        //$tableData = json_encode($data);
      //error_log(print_r($tableData, true), 0);
    error_log($data, 0);
	
		// $error = false;
		
		// if ( $data == null ) {
			// $error = true;
			// $errorMsg = "Failed to retrieve daily entries";
		// }
		// else {
			// $errorMsg = "Successfully retrieved daily entries";
		// }
			
		// echo json_encode(array(
					// "error" => $error,
					// "errorMsg" => $errorMsg, 
					// "data" => $data));
	
        echo $data;
        break;
      case 'daily_entries_condition_group':
        $conditionGroupNum = $_GET["conditionGroupNum"];
        error_log($conditionGroupNum,0);
        $conditionGroupData = getDailyEntryCG($conditionGroupNum);
        error_log($conditionGroupData,0);
		
		// $error = false;
		
		// if ( $conditionGroupData == null ) {
			// $error = true;
			// $errorMsg = "Failed to retrieve condition group daily entries";
		// }
		// else {
			// $errorMsg = "Successfully retrieved condition group daily entries";
		// }
			
		// echo json_encode(array(
					// "error" => $error,
					// "errorMsg" => $errorMsg, 
					// "data" => $conditionGroupData));
		
        echo $conditionGroupData;
        break;

    }
 
    break;
  case 'PUT':                              // not required in this controller
  case 'POST':                             // not required in this controller
  case 'DELETE':                           // not required in this controller
  default:
    http_response_code(404);
    // really also want to pass a message back to the client to indicate what the error was
    break;
}

/*function getDailyEntry($userID) {
  return
    '{"DailyEntries":[
    {"entryId":"1", 
      "userId":"1", 
      "date":"2016-12-24",
      "startTime":"09:00:00", 
      "startEnergy":"1234", 
      "endTime":"17:00:00", 
      "endEnergy":"2345", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2"},
      {"entryId":"2", 
      "userId":"1", 
      "date":"2016-12-30",
      "startTime":"09:30:00", 
      "startEnergy":"2234", 
      "endTime":"17:05:00", 
      "endEnergy":"3456", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2"},
      {"entryId":"3", 
      "userId":"1", 
      "date":"2016-12-31",
      "startTime":"09:30:00", 
      "startEnergy":"2004", 
      "endTime":"17:00:00", 
      "endEnergy":"3007", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2"}
      ]}';
}*/

/*function getDailyEntryCG($conditionGroupNum) {
  /* do a join of daily entries table & user table to get username for condition group ranking:
    ex: SELECT DailyEntries.entryId, DailyEntries.userId, Users.username, DailyEntries.date,
               DailyEntries.startTime, DailyEntries.startEnergy, DailyEntries.endTime,
               DailyEntries.endEnergy, DailyEntries.conditionGroupNum, DailyEntries.phaseNum, DailyEntries.teamNumber
        FROM DailyEntries
        INNER JOIN Users
        ON DailyEntries.userId = Users.userId

        TODO: remove numLikes, numShares, numPosts, numReminders from string?

  return  
    '{"DailyEntries":[
    {"entryId":"1", 
      "userId":"1",
      "username":"amy123", 
      "date":"2016-12-24",
      "startTime":"09:00:00", 
      "startEnergy":"1234", 
      "endTime":"17:00:00", 
      "endEnergy":"2345", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2",
      "teamNumber":"1"},
      {"entryId":"2", 
      "userId":"2",
      "username":"bob234", 
      "date":"2016-12-30",
      "startTime":"09:30:00", 
      "startEnergy":"2234", 
      "endTime":"17:05:00", 
      "endEnergy":"3456", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2",
      "teamNumber":"1"},
      {"entryId":"3", 
      "userId":"3",
      "username":"cathy789", 
      "date":"2016-12-31",
      "startTime":"09:30:00", 
      "startEnergy":"2004", 
      "endTime":"17:00:00", 
      "endEnergy":"3007", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2",
      "teamNumber":"2"},
      {"entryId":"4", 
      "userId":"4",
      "username":"emily456", 
      "date":"2016-12-31",
      "startTime":"09:30:00", 
      "startEnergy":"2004", 
      "endTime":"17:00:00", 
      "endEnergy":"3007", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2",
      "teamNumber":"2"},
      {"entryId":"5", 
      "userId":"5",
      "username":"fred456", 
      "date":"2016-12-31",
      "startTime":"09:30:00", 
      "startEnergy":"2004", 
      "endTime":"17:00:00", 
      "endEnergy":"3027", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2",
      "teamNumber":"2"},
      {"entryId":"6", 
      "userId":"6",
      "username":"grace456", 
      "date":"2016-12-31",
      "startTime":"09:30:00", 
      "startEnergy":"2994", 
      "endTime":"17:00:00", 
      "endEnergy":"2007", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2",
      "teamNumber":"1"}
      ]}';
}*/
?>