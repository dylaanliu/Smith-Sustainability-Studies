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
 if (!(authenticate("admin") || authenticate("admin"))) {
    header('HTTP/1.0 403 Forbidden');
    echo 'You are forbidden!';
    die();
}

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE

// TODO - TEMP just setting an admin ID that we know exists in the database. This should be 
// retrieved from the session if the user is validated and has permission to this page.
$adminID = '3';
    
// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    // need to check if this exists: ISSET?
    if(!isset($_GET["q"])) {
      htpp_response_code(500);
    }

    $queryType = $_GET["q"]; // don't need userID, as will use $_SESSION
    switch ($queryType) {
      case 'get_admin_studies':
        $error = false;
        $studies = getAdminStudies($adminID);
      //error_log(print_r($studies, true), 0);
        if ($studies == null) {
            $error = true;
            $errorMsg = 'No studies found';
            error_log("some error", 0);
        }
        else
            $errorMsg = 'Admin studies found';
        error_log("through", 0);
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "data" => $studies));
        break;
      case 'get_study_data':
        $error = false;
        $studyID = $_GET["studyID"];
        $study = getStudy($studyID);
        if ($study == null) {
            $error = true;
            $errorMsg = 'No study found';
            error_log("some error", 0);
        }
        else
            $errorMsg = 'Study found';
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "data" => $study));
        break;
      case 'get_posts':
      error_log("GET posts - admin monitor studies",0);
        $error = false;
        $studyID = $_GET["studyID"];
        $conditionGroup = $_GET["conditionGroup"];
        $phaseNum = $_GET["phaseNum"];
        $posts = getPostCGPhase($studyID, $conditionGroup, $phaseNum);
        if ($posts == null) {
            $error = true;
            $errorMsg = 'No post found';
            error_log("some error", 0);
        }
        else
            $errorMsg = 'Posts found';
        error_log("before echo", 0);
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "data" => $posts));
        error_log("after echoed",0);
        break;
    }
    break;
  case 'PUT':                              // not required in this controller
  case 'POST':                             // not required in this controller
  case 'DELETE':
    error_log("got into admin-monitor-users - DELETE");
        $error = false;
        // get parameters
        parse_str($_SERVER['QUERY_STRING'], $query_params);
        if (!isset($query_params['postID'])) {
            $error = true;
            $errorMsg = 'No post specified';
        }
        else if (!ctype_digit($query_params['postID'])){       // must be all digits
            $error = true;
            $errorMsg = 'Illegal post specified';
        }
        else {
            // check if there was an database error or nothing returned
            $postID = $query_params['postID'];
            
            if (!deletePost($postID)) {
                $error = true;
                $errorMsg = 'No post  found';
            }
            else
                $errorMsg = 'Post deleted';        
        }
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg));
        break;
        
    default:
        http_response_code(404);
        echo "Error: Unrecognised request.";
        echo json_encode(array(
                  "error" => true,
                  "errorMsg" => "Error: Unrecognised request."));
        break;
}

