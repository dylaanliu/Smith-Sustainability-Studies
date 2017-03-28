<?php
// load file to authenticate user and then determine if the authenticated user has permission to access this page
require_once 'utils/authenticateUser.php';
verifyUserPrivilage('user');

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE
// $userID = '1';
$userID = $_SESSION['userID'];
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
        $userID = isset($_SESSION['userID']) ? $_SESSION['userID'] : "13";  // TODO    
        $data = getDailyEntries($userID, true);
        $error = false;
        
        if ( $data == null ) {
          $error = true;
          $errorMsg = "Failed to retrieve daily entries";
        }
        else {
          $errorMsg = "Successfully retrieved daily entries";
        }
          
        echo json_encode(array(
              "error" => $error,
              "errorMsg" => $errorMsg, 
              "data" => $data));
        break;
      case 'daily_entries_condition_group':
        $conditionGroupNum = cleanInputGet("conditionGroupNum");
        $studyID = cleanInputGet("studyID");
        error_log($conditionGroupNum,0);
        $conditionGroupData = getDailyEntryCG($conditionGroupNum, $studyID);
        $error = false;
        
        if ($conditionGroupData == null ) {
          $error = true;
          $errorMsg = "Failed to retrieve condition group daily entries";
        }
        else {
          $errorMsg = "Successfully retrieved condition group daily entries";
        }
          
        echo json_encode(array(
              "error" => $error,
              "errorMsg" => $errorMsg, 
              "data" => $conditionGroupData));
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
      "phaseNum":"2"},
      {"entryId":"4", 
      "userId":"1", 
      "date":"2017-01-04",
      "startTime":"09:32:00", 
      "startEnergy":"2014", 
      "endTime":"17:00:00", 
      "endEnergy":"3007", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2"},
      {"entryId":"5", 
      "userId":"1", 
      "date":"2017-01-05",
      "startTime":"09:30:00", 
      "startEnergy":"2104", 
      "endTime":"17:00:00", 
      "endEnergy":"3007", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2"},
      {"entryId":"6", 
      "userId":"1", 
      "date":"2017-01-06",
      "startTime":"09:30:00", 
      "startEnergy":"2144", 
      "endTime":"17:00:00", 
      "endEnergy":"3007", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2"},
      {"entryId":"7", 
      "userId":"1", 
      "date":"2017-01-07",
      "startTime":"09:30:00", 
      "startEnergy":"2064", 
      "endTime":"17:00:00", 
      "endEnergy":"3007", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2"},
      {"entryId":"8", 
      "userId":"1", 
      "date":"2017-01-08",
      "startTime":"09:30:00", 
      "startEnergy":"2107", 
      "endTime":"17:00:0", 
      "endEnergy":"3107", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2"},
      {"entryId":"9", 
      "userId":"1", 
      "date":"2017-01-09",
      "startTime":"09:30:00", 
      "startEnergy":"2198", 
      "endTime":"17:00:00", 
      "endEnergy":"3007", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2"},
      {"entryId":"10", 
      "userId":"1", 
      "date":"2017-01-10",
      "startTime":"09:30:00", 
      "startEnergy":"2034", 
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
  do a join of daily entries table & user table to get username for condition group ranking:
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