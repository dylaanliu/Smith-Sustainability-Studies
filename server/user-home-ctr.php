<?php
// load file to authenticate user and then determine if the authenticated user has permission to access this page
require_once 'utils/authenticateUser.php';
verifyUserPrivilage('user');
// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE

//$userInfo = ""; // global var for user info
  $userID = isset($_SESSION['userID']) ? $_SESSION['userID'] : "13";  // TODO - used to debug. Should be $userID = $_SESSION['userID']
// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    error_log("got into user-home - GET");

    $queryType = cleanInputGet('q');
  
    switch ($queryType) {
      case "getUser":
        $userRecords = null;
        $error = false;
        if ($queryType === "getUser" && !empty($userID)) { 
            $userRecords = getUser($userID);
            if ($userRecords == null) {
                $error = true;
                $errorMsg = 'No user record found';
              error_log("Not user record found", 0);
            }
            else
                $errorMsg = 'User record found';
        }
        else {
            $error = true;
            $errorMsg = 'Unknown GET or userID';            
        }
        
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "data" => $userRecords));
        break;
      case "condition_group_phase":
    error_log("got into user-home - getting cg and phase permission");
        $studyID = $_GET["studyID"];
        $conditionGroupNum = $_GET["currentConditionGroup"];
        $phaseNum = $_GET["currentPhase"];
        $error = false;
        $conditionGroupPhaseInfo = getUserConditionGroupPhase($studyID, $conditionGroupNum, $phaseNum);
        header('Content-type: application/json');
        
    
    if ($conditionGroupPhaseInfo == null ) {
      error_log("null return",0);
      $error = true;
      $errorMsg = "Unable to get condition group and phase permissions";
    }
    else {
      error_log("should return info",0);
      error_log(print_r($conditionGroupPhaseInfo, true), 0);
      $errorMsg = "Successfully retrieved condition group and phase permissions";
    }
    
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "data" => $conditionGroupPhaseInfo));  
          
    //echo $conditionGroupPhaseInfo;
    
        break;
      case "rewards":
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

 
