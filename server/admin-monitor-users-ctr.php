<?php
session_start();
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

require_once 'utils/utils.php';
require_once 'model.php';

// only admins and super_admins are allowed to access this page
 if (!(authenticate("admin") || authenticate("super_admin"))) {
    header('HTTP/1.0 403 Forbidden');
    echo 'You are forbidden!';
    die();
}

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE

// TODO - TEMP just setting an admin ID that we know exists in the database. This should be 
// retrieved from the session if the user is validated and has permission to this page.
$adminID = '1';
    
switch ($method) {
  case 'GET':
    $error = false;
    $errorMsg = "";
    
    // get all studies the admin can see
    $studies = getAdminStudies($adminID);
    if ($studies == null) {
        $error = true;
        $errorMsg .= 'No studies found. ';
    }

    // get all condition groups this admin can see
    $conditionGroupPhases = getAdminConditionGroupPhase($adminID);
    if ($conditionGroupPhases == null) {
        $error = true;
        $errorMsg .= 'No condition groups found. ';
    }
    
    // get all users this admin can see.
    // TO DO - users that are not visible to admin should be filtered
    $users = getAllUsers();
    if ($users == null) {
        $error = true;
        $errorMsg .= 'No users found. ';
    }

    // get all daily entries this admin can see ordered by the entry date.
    // TO DO - daily entries of users that are not visible to admin should be filtered
    $dailyEntries = getAllDailyEntries();
    if ($users == null) {
        $error = true;
        $errorMsg .= 'No daily entries found. ';
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




// get all the records from the dailyEntries table. Return results sorted by date
function getAllDailyEntries() {
    
    $conn = dbConnect();
    $result = mysqli_query($conn, "SELECT * FROM dailyEntriesTable ORDER BY entryDate ASC");

    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        }
    }
    
    mysqli_close($conn);    
    return $rows;
}
