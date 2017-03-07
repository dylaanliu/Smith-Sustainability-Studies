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

/*function getStudy($studyID){
  // need a JOIN for study and Admin Study table
  return '[{"studyId":"1", 
      "adminId":"1", 
      "name":"Study 1 Effect of Social Media:",
      "description":"my description text", 
      "conditionGroups":"5", 
      "phases":"3",
      "startDate":"",
      "endDate": ""},
      {"studyId":"2", 
      "adminId":"1", 
      "name":"Study 2 Effect of Sunshine and Rainbows:",
      "description":"description text2", 
      "conditionGroups":"3", 
      "phases":"3",
      "startDate":"",
      "endDate": ""},
      {"studyId":"4", 
      "adminId":"1", 
      "name":"Study 4 Dangers of Cute Cat Videos:",
      "description":"Studies the detrimental effects of cute cat videos on the study habits of college students.", 
      "conditionGroups":"4", 
      "phases":"2",
      "startDate":"",
      "endDate": ""},
      {"studyId":"6", 
      "adminId":"1", 
      "name":"Study 6 TWD and Smurf collecting:",
      "description":"Measures the tendency of kids who collect Smurfs relative to their grown up need for Total World Domination", 
      "conditionGroups":"3", 
      "phases":"5",
      "startDate":"",
      "endDate": ""},
      {"studyId":"7", 
      "adminId":"1", 
      "name":"Study 7 Walking and Health:",
      "description":"Examines if increase hours of watching the Walking Dead leads to a more healthy life style.", 
      "conditionGroups":"5", 
      "phases":"2",
      "startDate":"",
      "endDate": ""}
     ]';
}*/
