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

        // basic input validation. 
        // TODO:
        // Should really check all fields for validity (valid characters, maxlength, valid ranges, etc)
        if (empty($titleIn)) {
            $error = true;
            $errorMsg = 'Study title required.';
        }
        
        // create the Study record in the studyTable table
        if (!$error) {
            date_default_timezone_set('America/Toronto');
            $startDate = date('Y-m-d H:i:s');
            $endDate = "2035-12-31 00:00:00";
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
        $numConditionGroupPhaseRecords == 0;
        for ($cg = 1; !$error && $cg <= $conditionGroupsIn; $cg++) {            
            for ($ph = 1; !$error && $ph <= $phaseIn; $ph++) {
                $phasePermission = makePhasePermission($cg, $ph);
                $newConditionGroupPhase = createConditionGroupPhase($newStudy['studyID'], $cg, $ph, 0, 0, 
                                                $phasePermission, 0, 0, 0);
                if ($newConditionGroupPhase == null) {
                    $error = true;
                    $errorMsg = 'Database error: Could not condition group phase record: ';
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


function isChecked($chkname, $value) {

    if(!empty($_POST[$chkname])) {
        foreach($_POST[$chkname] as $chkval) {
            if($chkval == $value) {
                return true;
            }
        }
    }
    return false;
}


// go through $_POST and look for the checkboxes that are checked to create a phasePermission mask
// for a conditionGroupPhaseTable record.
//          Bit Fields
//           1  Data Entry
//           2  Personal Statistics
//           3  Conditional Group Statistics
//           4  Sub-team Statistics
//           5  Share to Social Media
//           6  Submit Tips
//           7  View Admin Tips
//           8  View Condition Group Tips
//           9  View Sub-team Tips
//           10 Share Posts to Social Media
//           11 Private
//           12 Public
//           13 Progression System
//
function makePhasePermission($cg, $ph) {
    $phasePermissionStr = "";
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "progressionSystem") ? "1" : "0";
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "public") ? "1" : "0";
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "private") ? "1" : "0";
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "sharePostsToSocialMedia") ? "1" : "0";
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "viewSubTeamTips") ? "1" : "0";
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "viewConditionGroupTips") ? "1" : "0";
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "viewAdminTips") ? "1" : "0";
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "submitTips") ? "1" : "0";
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "shareToSocialMedia") ? "1" : "0";
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "subTeamStatistics") ? "1" : "0";
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "conditionGroupStatistics") ? "1" : "0";
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "personalStatistics") ? "1" : "0";    
    $phasePermissionStr .= isChecked("phasePermissions_".$cg."_".$ph, "dataEntry") ? "1" : "0";

    return $phasePermissionStr;
}
