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
//////////////////////////////////////////////////////////////////////////////////

require_once 'utils/utils.php';
require_once 'model.php';


// TODO put in below just for DEBUGGING
//$_SESSION['privilegeLevel'] = "super_admin";
//$_SESSION['privilegeLevel'] = "admin";

// only admins and super_admins are allowed to access this page
 if (!(authenticate("admin") || authenticate("super_admin"))) {
    header('HTTP/1.0 403 Forbidden');
    echo 'You are forbidden!';
    die();
}

$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE

// TODO - TEMP just setting an admin ID that we know exists in the database. This should be 
// retrieved from the session if the user is validated and has permission to this page.
$adminID = '1';
    
error_log("got into admin-manage-studies. Method");
error_log($method);

// create SQL based on HTTP method
switch ($method) {
    case 'GET':
error_log("got into admin-manage-studies - GET");
        $error = false;
        $studies = null;
        $conditionGroupPhase = null;
        $q = cleanInputGet('q');

        $studies = getAdminStudies($adminID);
        if ($studies == null) {
            $error = true;
            $errorMsg = 'No studies found';
        }
        else {
            $errorMsg = 'Admin studies found.';

            $conditionGroupPhase = getAdminConditionGroupPhase($adminID);
            if ($conditionGroupPhase == null) {
                $error = true;
                $errorMsg = 'Database error accessing conditionGroupTable';
            }
        }
        
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "conditionGroupPhase" => $conditionGroupPhase,
                  "studies" => $studies));
        break;
        
    case 'PUT':
error_log("got into admin-manage-studies - PUT");
        $error = false;
        $userRecords = null;
        
        break;
                
    case 'POST':
error_log("got into admin-manage-studies - POST");
        $error = false;
        $userRecords = null;
        
        break;
        
    case 'DELETE':                           
error_log("got into admin-manage-studies - DELETE");
        $error = false;
        break;
        
    default:
        http_response_code(404);
        echo "Error: Unrecognised request.";
        echo json_encode(array(
                  "error" => true,
                  "errorMsg" => "Error: Unrecognised request."));
        break;
}





            
