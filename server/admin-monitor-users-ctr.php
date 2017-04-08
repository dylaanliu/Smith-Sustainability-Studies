<?php
// load file to authenticate user and then determine if the authenticated user has permission to access this page
require_once 'utils/authenticateUser.php';
verifyUserPrivilage('admin');

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE
// $userID = '1';
$userID = $_SESSION['userID'];
    
switch ($method) {
  case 'GET':
    $error = false;
    $errorMsg = "";
    
    // get all studies the admin can see
    $studies = getAdminStudies($userID);
    if ($studies == null) {
        $error = true;
        $errorMsg .= 'No studies found. ';
        //error_log("no studies found", 0);
    }

    // get all condition groups this admin can see
    $conditionGroupPhases = getAdminConditionGroupPhase($userID);
    if ($conditionGroupPhases == null) {
        $error = true;
        $errorMsg .= 'No condition groups found. ';
       // error_log("no condition groups found", 0);
    }
    
    // get all users this admin can see.
    // TO DO - users that are not visible to admin should be filtered
    $users = getAllUsers();
    if ($users == null) {
        $error = true;
        $errorMsg .= 'No users found. ';
       // error_log("no users found",0);
    }

    // get all daily entries this admin can see ordered by the entry date.
    // TO DO - daily entries of users that are not visible to admin should be filtered
    $dailyEntries = getAllAdminDailyEntries();
    if ($users == null) {
        $error = true;
        $errorMsg .= 'No daily entries found. ';
       // error_log("no daily entries found", 0);
    }

    echo json_encode(array(
              "error" => $error,
              "errorMsg" => $errorMsg, 
              "studies" => $studies,
              "conditionGroupPhases" => $conditionGroupPhases,
              "users" => $users,
              "dailyEntries" => $dailyEntries));
    break;
  case 'PUT':                              // not required in this controller
  case 'POST':                             // not required in this controller
  case 'DELETE':                           // not required in this controller
  default:
    http_response_code(404);
    // really also want to pass a message back to the client to indicate what the error was
    break;
}


