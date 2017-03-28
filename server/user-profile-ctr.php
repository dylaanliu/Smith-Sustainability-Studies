<?php
session_start();
/*
THIS IS JUST A FAKED OUT REST API CONTROLLER ON THE SERVER SIDE. IT IS MISSING A LOT INCLUDING
AUTHENTICATION and SECURITY (SQLi, XSS, CFRF). IN ADDITION, THERE IS NO SERVER SIDE INPUT VALIDATION.
OTHER POSSIBLE MISSING FEATURES ARE:
    No related data (automatic joins) supported
    No condensed JSON output supported
    No support for PostgreSQL or SQL Server
    No POST parameter support
    No JSONP/CORS cross domain support
    No base64 binary column support
    No permission system
    No search/filter support
    No pagination or sorting supported
    No column selection supported
SEE
https://www.leaseweb.com/labs/2015/10/creating-a-simple-rest-api-in-php/  
*/

require_once 'utils/utils.php';
require_once 'model.php';

error_log("SESSION userID = ".$_SESSION['userID']);

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE
error_log("got into admin-user-accounts. Method=".$method);

// create SQL based on HTTP method
switch ($method) {
    case 'GET':
error_log("got into user-profile - GET");
        $q = cleanInputGet('q');
        $userID = isset($_SESSION['userID']) ? $_SESSION['userID'] : "13";  // TODO - used to debug. Should be $userID = $_SESSION['userID']
        $userRecords = null;
        $error = false;
        
        if ($q === "getUser" && !empty($userID)) { 
            $userRecords = getUser($userID);
            if ($userRecords == null) {
                $error = true;
                $errorMsg = 'No user record found';
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

    case 'PUT':
error_log("got into admin-profile - PUT");
        $error = false;
        
        // get user parameters/prevent sql injections/clear user invalid input
        parse_str(file_get_contents("php://input"), $put_vars);
        $userID = isset($_SESSION['userID']) ? $_SESSION['userID'] : "13";  // TODO - used to debug. Should be $userID = $_SESSION['userID']
        $userNameIn = cleanInputPut($put_vars['userName']);
        $emailIn = cleanInputPut($put_vars['email']);
        $passwordIn = cleanInputPut($put_vars['password']);
        $confirm_passwordIn = cleanInputPut($put_vars['confirm_password']);

        // TODO:
        // Should really check all fields for validity (valid characters, email format, length, etc)
        // Some validation examples below.
        if (empty($userNameIn)) {
            $error = true;
            $errorMsg = 'UserID is required.';
        }
        if (empty($passwordIn)) {
            $error = true;
            $errorMsg = 'User name is required.';
        }
        if ($passwordIn != $confirm_passwordIn) {
            $error = true;
            $errorMsg = 'Password fields miss-match';
        }
 
        if (!$error) {
            $success = updateProfile($userID, $userNameIn, $passwordIn, $emailIn);
            if (!$success) {
                $error = true;
                $errorMsg = 'Database error: Could not update user: '.$userNameIn;
            } else {
                $errorMsg = 'User record updated.';
            }
        }        
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "data" => null));
        break;
                  
    case 'POST':
    case 'DELETE':
    default:
        http_response_code(404);
        // really also want to pass a message back to the client to indicate what the error was
    break;
}


?>

 
