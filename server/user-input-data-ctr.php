<?php
// load file to authenticate user and then determine if the authenticated user has permission to access this page
require_once 'utils/authenticateUser.php';
verifyUserPrivilage('user');

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE
$userID = isset($_SESSION['userID']) ? $_SESSION['userID'] : "13";  // TODO - used 

error_log('hello php1',0);
error_log($method,0);    
//$userInfo = ""; // global var for user info

// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    $complete = false;
    $incompleteEntries = getDailyEntries($userID, $complete);
    error_log(print_r($incompleteEntries, true), 0);
    $error = false;
    error_log("in get - user input", 0);
    if ( $incompleteEntries == null ) {
      $error = true;
      $errorMsg = "Failed to retrieve daily entries";
    }
    else {
      $errorMsg = "Successfully retrieve daily entries";
    }
      
    echo json_encode(array(
          "error" => $error,
          "errorMsg" => $errorMsg, 
          "data" => $incompleteEntries));
    break;
  case 'PUT':
  error_log('hello php2',0);
    parse_str(file_get_contents("php://input"), $put_vars);
    $entryID = $put_vars["entryID1"];
    $toUpdate = array("entryID" => $entryID);
    $entryDate = $put_vars["entryDate1"];
    if ($entryDate != null) {
      $toUpdate["entryDate"] = $entryDate;
    } 
    $startTime = $put_vars["startTime1"];
    if ($startTime != "00:00:00") {
      $toUpdate["startTime"] = $startTime;
    } 
    $startEnergy = $put_vars["startEnergy1"];
    if ($startEnergy != 0) {
      $toUpdate["startEnergy"] = $startEnergy;
    } 
    $endTime = $put_vars["endTime1"];
    if ($endTime != "00:00:00") {
      $toUpdate["endTime"] = $endTime;
    } 
    $endEnergy = $put_vars["endEnergy1"];
    if ($endEnergy != 0) {
      $toUpdate["endEnergy"] = $endEnergy;
    } 
  error_log(print_r($toUpdate, true), 0);
    $updatedData = updateDailyEntry($userID, $entryID, $toUpdate);
  error_log(gettype($updatedData),0);
    $error = false;
  
    if ( ! $updatedData ) {
      $error = true;
      $errorMsg = "Failed to update daily entries";
    }
    else {
      $errorMsg = "Successfully updated daily entries";
    }
      
    echo json_encode(array(
          "error" => $error,
          "errorMsg" => $errorMsg, 
          "data" => $updatedData));
      
    break;
  case 'POST':
    error_log("posting");
    $entryDate_in = cleanInputPost("entryDate1");
    $studyID_in = cleanInputPost("studyID1");
    $teamNumber_in = cleanInputPost("teamNumber1");
    // to do: user cleanInputGet function
  error_log($entryDate_in);
    $startTime_in = trim($_POST["startTime1"]);
    $startTime_in = strip_tags($startTime_in);
    $startTime_in = htmlspecialchars($startTime_in);
  error_log($startTime_in);
    $startEnergy_in = trim($_POST["startEnergy1"]);
    $startEnergy_in = strip_tags($startEnergy_in);
    $startEnergy_in = htmlspecialchars($startEnergy_in);
  error_log($startEnergy_in);
    $endTime_in = trim($_POST["endTime1"]);
    $endTime_in = strip_tags($endTime_in);
    $endTime_in = htmlspecialchars($endTime_in);
  error_log($endTime_in);
    $endEnergy_in = trim($_POST["endEnergy1"]);
    $endEnergy_in = strip_tags($endEnergy_in);
    $endEnergy_in = htmlspecialchars($endEnergy_in);
  error_log($endEnergy_in);
    $CurrentConditionGroup_in = trim($_POST["CurrentConditionGroup1"]);
    $CurrentConditionGroup_in = strip_tags($CurrentConditionGroup_in);
    $CurrentConditionGroup_in = htmlspecialchars($CurrentConditionGroup_in);
  error_log($CurrentConditionGroup_in);
    $currentPhase_in = trim($_POST["currentPhase1"]);
    $currentPhase_in = strip_tags($currentPhase_in);
    $currentPhase_in = htmlspecialchars($currentPhase_in);
/*  error_log($studyID_in);
    $studyID_in = trim($_POST["studyID1"]);
    $studyID_in = strip_tags($studyID_in);
    $studyID_in = htmlspecialchars($studyID_in);
    */ 
    error_log("study: ",0);
    error_log($studyID_in);
  $success = createDailyEntry($userID, $entryDate_in, $startTime_in, $startEnergy_in, $endTime_in, $endEnergy_in, $CurrentConditionGroup_in, $currentPhase_in, $studyID_in, $teamNumber_in);
  $error = false;
  
  if (!$success ) {
    $error = true;
    $errorMsg = "Failed to create entry";
  }
  else {
    $errorMsg = "Successfully created entry";
  }
    
  echo json_encode(array(
        "error" => $error,
        "errorMsg" => $errorMsg, 
        "success" => $success));
  
    break;
  case 'DELETE':                           // not required in this controller
  default:
//error_log('hello php3',0);
    http_response_code(404);
    // really also want to pass a message back to the client to indicate what the error was
    break;
}


/*function getDailyEntries($userID, $complete) {
    return
    '{"DailyEntries":[
    {"entryId":"1", 
      "userId":"1", 
      "date":"2016-12-24",
      "startTime":"09:00:00", 
      "startEnergy":"1234", 
      "endTime":"17:00:00", 
      "endEnergy":"0", 
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
      "endTime":"00:00:00", 
      "endEnergy":"0", 
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
      "startEnergy":"2234", 
      "endTime":"00:00:00", 
      "endEnergy":"0", 
      "numLikes":"0", 
      "numShares":"0", 
      "numPosts":"10", 
      "numReminders": "2", 
      "conditionGroupNum":"1", 
      "phaseNum":"2"}
      ]}';

      //return $userInfo;
 
}
*/
/*function updateDailyEntry($userID, $entryID, $toUpdate){
  // do update here
error_log("hello9", 0);

  $updatedData = json_encode($toUpdate);
  return $updatedData;
 
}*/

/*function createDailyEntry($userID, $entryDate, $startTime, $startEnergy, $endTime, $endEnergy, 
  $CurrentConditionGroup, $currentPhase) {
  error_log("creating entry", 0);
  $newEntryData = array("userId" => $userID,
                        "date" => $entryDate,
                        "startTime" => $startTime,
                        "startEnergy" => $startEnergy,
                        "endTime" => $endTime,
                        "endEnergy" => $endEnergy,
                        "CurrentConditionGroup" => $CurrentConditionGroup,
                        "currentPhase" => $currentPhase);
  error_log(print_r($newEntryData, true), 0);

  // do CREATE here
  return true;
}*/

?>

 
