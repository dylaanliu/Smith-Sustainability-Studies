<?php
// load file to authenticate user and then determine if the authenticated user has permission to access this page
require_once 'utils/authenticateUser.php';
verifyUserPrivilage('user');

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE
$userID = $_SESSION['userID']; //? $_SESSION['userID'] : "13";  // TODO - used 

/*error_log('hello php1',0);
error_log($method,0);*/    
//$userInfo = ""; // global var for user info

// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    $complete = false;
    $incompleteEntries = getDailyEntries($userID, $complete);
    //error_log(print_r($incompleteEntries, true), 0);
    $error = false;
    //error_log("in get - user input", 0);
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
    $error = false;
    $errorMsg = "";
    $updatedData = null;

//error_log('hello php2',0);
    parse_str(file_get_contents("php://input"), $put_vars);
    $entryID = cleanInputPut($put_vars["entryID1"]);
    $toUpdate = array("entryID" => $entryID);
    $entryDate = cleanInputPut($put_vars["entryDate1"]);
    if ($entryDate != null) {
      $toUpdate["entryDate"] = $entryDate;
    } 
    $startTime = $put_vars["startTime1"];
    if ($startTime != "00:00:00") {
      $toUpdate["startTime"] = $startTime;
    } 
    $startEnergy = cleanInputPut($put_vars["startEnergy1"]);
    if ($startEnergy != 0) {
      $toUpdate["startEnergy"] = $startEnergy;
    } 
    $endTime = cleanInputPut($put_vars["endTime1"]);
    if ($endTime != "00:00:00") {
      $toUpdate["endTime"] = $endTime;
    } 
    $endEnergy = cleanInputPut($put_vars["endEnergy1"]);
    if ($endEnergy != 0) {
      $toUpdate["endEnergy"] = $endEnergy;
    } 
    
    // try to complete entry. Only allow entries to be completed if end energy is greater that 
    // start energy.
    // TODO : really should check if end time is greater than start time as well
    if (floatval($startEnergy) > 0 && floatval($endEnergy) >= floatval($startEnergy)) {
/*error_log(print_r($toUpdate, true), 0);
error_log(gettype($updatedData),0);*/

        $updatedData = updateDailyEntry($userID, $entryID, $toUpdate);
        if (!$updatedData) {
          $error = true;
          $errorMsg .= "Database Error: Failed to update daily entries. ";
        }
        else {
          $errorMsg .= "Successfully updated daily entries. ";
//error_log("startEnergy=".$startEnergy." endEnergy=".$endEnergy);      
          if (!operateUserTable($userID, "incr", "entriesNumPhase") || !operateUserTable($userID, "incr", "entriesNumTotal")) {
            $error = true;
            $errorMsg .= "Database Error: Could not update number of Entries";
          }
          else {
            $phaseUpdated = updatePhase($userID);
          }
        }          
    }
    else {
      $error = true;
      $errorMsg = "Failed to update daily entries. End energy is less than start energy";        
    }
          
    echo json_encode(array(
          "error" => $error,
          "errorMsg" => $errorMsg, 
          "data" => $updatedData));
      
    break;
    
  case 'POST':
   // error_log("posting");
    $entryDate_in = cleanInputPost("entryDate1");
    $startTime_in = cleanInputPost("startTime1");
    $startEnergy_in = cleanInputPost("startEnergy1");
    $endTime_in = cleanInputPost("endTime1");
    $endEnergy_in = cleanInputPost("endEnergy1");
    $CurrentConditionGroup_in = cleanInputPost("CurrentConditionGroup1");
    $currentPhase_in = cleanInputPost("currentPhase1");
    $studyID_in = cleanInputPost("studyID1");
    $teamNumber_in = cleanInputPost("teamNumber1");
/*
    error_log("study: ",0);
    error_log($studyID_in);*/
    $success = createDailyEntry($userID, $entryDate_in, $startTime_in, $startEnergy_in, $endTime_in, $endEnergy_in, $CurrentConditionGroup_in, 
                                $currentPhase_in, $studyID_in, $teamNumber_in);
    $error = false;
    if (!$success ) {
      $error = true;
      $errorMsg = "Failed to create entry";
    }
    else {
      $errorMsg = "Successfully created entry. ";
      if ($startEnergy_in > 0 && $endEnergy_in >= $startEnergy_in) {
        if (!operateUserTable($userID, "incr", "entriesNumPhase") || !operateUserTable($userID, "incr", "entriesNumTotal")) {
          $error = true;
          $errorMsg .= "Database Error: Could not like Post";
        }
        else {
          $phaseUpdated = updatePhase($userID);
        }
      }          
    }
    
    echo json_encode(array(
        "error" => $error,
        "errorMsg" => $errorMsg, 
        "success" => $success));
  
    break;
    
  case 'DELETE':                           // not required in this controller
  default:
    http_response_code(404);
    // really also want to pass a message back to the client to indicate what the error was
    break;
}


?>

 
