<?php
// load file to authenticate user and then determine if the authenticated user has permission to access this page
require_once 'utils/authenticateUser.php';
verifyUserPrivilage('admin');

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE

$userID = $_SESSION['userID'];
    
// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    $error = false;
    $errorMsg = '';
    $studies = null;
    $conditionGroupPhase = null;
    $queryTypeIn = cleanInputGet('q');
//error_log("in GET - admin-home",0);
  
    if (empty($queryTypeIn)) {
        $error = true;
        $errorMsg .= 'Missing Query type. ';
    }
  
    if ($queryTypeIn == "getAdminStudies") {
        $studies = getAdminStudies($userID);
        if ($studies == null) {
            $error = true;
            $errorMsg = 'No studies found';
//error_log("no studies found", 0);
        }
        else {
            $errorMsg = 'Admin studies found';
//error_log(print_r($studies, true), 0);
        }
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "data" => $studies));
    } 
    else if ($queryTypeIn == "getAll") {
        
        // get all studies the admin can see
        $studies = getAdminStudies($userID);
        if ($studies == null) {
            $error = true;
            $errorMsg .= 'No studies found. ';
        }

        // get all condition groups this admin can see
        $conditionGroupPhases = getAdminConditionGroupPhase($userID);
        if ($conditionGroupPhases == null) {
            $error = true;
            $errorMsg .= 'No condition groups found. ';
        }
        
        // get all users.
        $users = getAllUsers();
        if ($users == null) {
            $error = true;
            $errorMsg .= 'No users found. ';
        }
        else {        
            // filter out the admin and super_admins from the list
/*             $exclude = array( 'admin', 'super_admin' );

            // Now do the filter, using a closure
            $filteredUsers = array_filter( $users, function( $user ) use ( $exclude ) {
//error_log("user=".print_r($user));
                if (in_array($user['privilegeLevel'], $exclude)) 
                    return false;
                return true;
            }); */
        }

        // get all daily entries this admin can see ordered by the entry date.
        // TO DO - daily entries of users that are not visible to admin should be filtered
        $dailyEntries = getAllAdminDailyEntries();
        if ($users == null) {
            $error = true;
            $errorMsg .= 'No daily entries found. ';
        }
        else {
            // filter out the entries that the admin cannot see
        }

        // get all posts this admin can see ordered by the entry date.
        $posts = getAllPosts();
        if ($posts == null) {
            $error = true;
            $errorMsg .= 'No posts found. ';
        }
        else {
            // filter out the entries that the admin cannot see
        }
                
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "studies" => $studies,
                  "conditionGroupPhases" => $conditionGroupPhases,
                  "users" => $users,
                  "posts" => $posts,
                  "dailyEntries" => $dailyEntries
                ));
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





