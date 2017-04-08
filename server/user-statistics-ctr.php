<?php
// load file to authenticate user and then determine if the authenticated user has permission to access this page
require_once 'utils/authenticateUser.php';
verifyUserPrivilage('user');

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE
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
        //$userID = isset($_SESSION['userID']) ? $_SESSION['userID'] : "13";  // TODO    
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
        //error_log($conditionGroupNum,0);
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
?>