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

// only admins and super_admins are allowed to access this page
 if (!(authenticate("admin") || authenticate("super_admin"))) {
    header('HTTP/1.0 403 Forbidden');
    echo 'You are forbidden!';
    die();
}

$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE
error_log("got into admin-create-study. Method".$method);

// create SQL based on HTTP method
switch ($method) {
    case 'POST':
error_log("got into admin-create-study - POST");
        $error = false;
        
        // get user parameters/prevent sql injections/clear user invalid input
        $titleIn = cleanInputPost('title');
        $descriptionIn = cleanInputPost('description');
        $conditionGroupsIn = cleanInputPost('conditionGroupSelector');
        $phaseIn = cleanInputPost('phaseSelector');
error_log($titleIn." ".$descriptionIn." ".$conditionGroupsIn." ".$phaseIn, 0);
        // basic input validation. 
        // TODO:
        // Should really check all fields for validity (valid characters, maxlength, valid ranges, etc)
        if (empty($titleIn)) {
            $error = true;
            $errorMsg = 'Study title required.';
        }
        
        // create the Study record in the studyTable table
        if (!$error) {
            // need to set dates, otherwise we get an error
            date_default_timezone_set('America/Toronto');
            $startDate = date('Y-m-d H:i:s'); // when the study is made active
            $endDate = "2035-12-31 00:00:00"; // when the study is archived

            $newStudy = createStudy($titleIn, $descriptionIn, $conditionGroupsIn, $phaseIn, $startDate, $endDate, "created");
            if ($newStudy == null) {
                $error = true;
                $errorMsg = 'Database error: Could not create study: '.$titleIn;
            } 
            else {
                $errorMsg = 'Study record created.';
            }
        }        
        // create the admin-study records in the adminStudiesTable table
        if (!$error) {
            // to facilatate testing, if $_SESSION['userID'] does not exist, just set the user to the 
            // super_admin whose userID should be 1.
            $userID = (isset($_SESSION['userID'])) ? $_SESSION['userID'] : '1';
            $numAdminStudyRecords = createAdminStudies($userID, $newStudy['studyID']);
            if ($numAdminStudyRecords == 0) {
                $error = true;
                $errorMsg = 'Database error: Could not create any Admin Study records';
            } 
            else {
                $errorMsg = 'Number of Admin Study records created = '.$numAdminStudyRecords;
            }
        }        
        
        // create the condition/phase records in the conditionGroupPhaseTable table for
        // this study.
        // TODO - should really clean up if there was an error during the creation
        //        of the records to avoid orphan records
        //      - should be server side checking that the 'Num' fields are numbers
        $numConditionGroupPhaseRecords == 0;
        for ($cg = 1; !$error && $cg <= $conditionGroupsIn; $cg++) {            
            for ($ph = 1; !$error && $ph <= $phaseIn; $ph++) {
                $phasePermission = makePhasePermission("POST", $cg, $ph);
                $entriesNum = cleanInputPost('entriesNum_'.$cg.'_'.$ph); 
                $postsNum = cleanInputPost('postsNum_'.$cg.'_'.$ph);
                $likesNum = cleanInputPost('likesNum_'.$cg.'_'.$ph);

                if (empty($entriesNum)) 
                    $entriesNum = 0;
                if (empty($postsNum)) 
                    $postsNum = 0;
                if (empty($likesNum)) 
                    $likesNum = 0;
                
                $newConditionGroupPhase = createConditionGroupPhase($newStudy['studyID'], $cg, $ph, 0, 0, 
                                                $phasePermission, $entriesNum, $postsNum, $likesNum);
                if ($newConditionGroupPhase == null) {
                    $error = true;
                    $errorMsg = 'Database error: Could not create condition group phase record: ';
                } 
                else {
                    $errorMsg = 'Study Successfully Created';              
                    $numConditionGroupPhaseRecords++;
                }
            }
        }

        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "data" => $newStudy));
       break;
        
    case 'GET':
error_log("got into admin-create-study - GET");
        $error = false;
    case 'PUT':
error_log("got into admin-create-study - PUT");
        $error = false;
    case 'DELETE':                           
error_log("got into admin-create-study - DELETE");
        $error = false;
    default:
        http_response_code(404);
        echo "Error: Unrecognised request.";
        echo json_encode(array(
                  "error" => true,
                  "errorMsg" => "Error: Unrecognised request."));
        break;
}

