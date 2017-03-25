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
    
error_log("got into admin-manage-studies. Method: ".$method);

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
        $errorMsg = "";
        $userRecords = null;
        
        // get parameters. Get form string from client and convert to associated array 
        // unique array names
        error_log("output");
        error_log(file_get_contents("php://input"));
        $nameVal = json_decode(file_get_contents("php://input"), true);
        foreach($nameVal as $pair){
            //error_log("key=".$pair['name'].", value=".$pair['value']);
            $put_vars[$pair['name']] = $pair['value'];
        }
        
        $putTypeIn = cleanInputPut($put_vars['putType']);
        $studyIDIn = cleanInputPut($put_vars['studyID']);
        if (empty($putTypeIn)) {
            $error = true;
            $errorMsg .= 'Missing PUT type. ';
        }
        if (empty($studyIDIn)) {
            $error = true;
            $errorMsg .= 'Missing study ID. ';
        }
        
        // Handle PUT request to split a Team into 2 sub teams
        if (!$error && $putTypeIn == "splitSubTeams") {
            $conditionGroupIn = cleanInputPut($put_vars['conditionGroup']);
            if (empty($conditionGroupIn)) {
                $error = true;
                $errorMsg .= 'Missing condition group. ';
            }

            // 1) get all the users that are in the same study and condition group
            $userRecords = getAllUsers();
            if ($userRecords == null) {
                $error = true;
                $errorMsg .= 'No user records found. ';
            }

            // 2) check if the users have been split into sub teams already, and how many users.
            if (!$error) {
                $numUsers = 0;
                $initial = true;
                $teamNum = -1;
                foreach($userRecords as $userRecord) {
                    if ($userRecord["studyID"] == $studyIDIn && $userRecord["currentConditionGroup"] == $conditionGroupIn) {
                        $numUsers++;
                        if ($initial) {
                            $initial = false;
                            $teamNum = $userRecord["teamNum"];                            
                        }
                        else if ($userRecord["teamNum"] != $teamNum){
                            $error = true;
                            $errorMsg .= 'Error, condition group already split into sub-teams. ';
                            break;
                        }
                    }
                } 
                // if 0 or 1 users, cannot split
                if ($numUsers == 0 || $numUsers == 1) {
                    $error = true;
                    $errorMsg .= 'Cannot split into sub-teams. Number of users = '.$numUsers;                    
                }
            }
            
            // 3) if they have not been split, then split them into sub-teams
            if (!$error) {
                $odd = true;
                foreach($userRecords as $userRecord) {
                    if ($userRecord["studyID"] == $studyIDIn && $userRecord["currentConditionGroup"] == $conditionGroupIn) {
                        if ($odd) {
                            if (!operateUserTable($userRecord["userID"], "incr_teamNum")) {
                                $error = true;
                                $errorMsg .= ' Database error: could not increment team number.';
                            }    
                        }
                        $odd = !$odd;
                    }
                }    
            }
        }

        // Handle PUT request to update study in the studyTable and conditionGroupPhaseTable
        if (!$error && $putTypeIn == "studyForm") {
            $descriptionIn = cleanInputPut($put_vars['description'.$studyIDIn]);
            if (empty($descriptionIn)) {
                $descriptionIn = "";
            }
            $statusIn = cleanInputPut($put_vars['studyStatusSelector'.$studyIDIn]);
            if (empty($statusIn)) {
                $error = true;
                $errorMsg .= ' Input error. Status expected. No update performed.';
            }

            // update the study table
            if (!$error) {
                $error = !updateStudy($studyIDIn, array("description" => $descriptionIn, 
                                                        "status"      => $statusIn ));
                if ($error) 
                    $errorMsg .= ' Database error: could not update study table';
                else
                    $errorMsg .= ' Study table updated.';
            }
            
            // get the list of condition groups and the list of phases to update
            $CGList = array();
            $PGList = array();
            foreach ($put_vars as $parm => $value) {
                $fields = explode("_", $parm);
                if ($fields[0] == "entriesNum" && $fields[2] == "1") { // one phase per CG for entry number
                    $CGList[] = $fields[1];
                }
                if ($fields[0] == "entriesNum" && $fields[1] == $CGList[0]) { // for an existing CG, get the phases
                    $PGList[] = $fields[2];
                }
            }

            // go through list of CG and phase and update the conditionGroupPhaseTable
            foreach ($CGList as $parm => $cg) {
                foreach ($PGList as $parm => $ph) {
                    $phasePermission = makePhasePermission("PUT", $cg, $ph);
                    $entriesNum = cleanInputPut($put_vars['entriesNum_'.$cg.'_'.$ph]); 
                    $postsNum = cleanInputPut($put_vars['postsNum_'.$cg.'_'.$ph]);
                    $likesNum = cleanInputPut($put_vars['likesNum_'.$cg.'_'.$ph]);

                    // TODO - should really not allow 0 and indicate so
                    if (empty($entriesNum)) 
                        $entriesNum = 0;
                    if (empty($postsNum)) 
                        $postsNum = 0;
                    if (empty($likesNum)) 
                        $likesNum = 0;

                    $success = updateConditionGroupPhase($studyIDIn, $cg, $ph, array( 
                                                                            phasePermission => $phasePermission, 
                                                                            entriesNum => $entriesNum, 
                                                                            postsNum => $postsNum,
                                                                            likesNum => $likesNum ));
                    if ($success) {
                        $errorMsg .= ' Condition Groups updated.';              
                    } 
                    else {
                        $error = true;
                        $errorMsg .= ' Database error: Could not update condition group phase record. ';
                    }
                }
            }
        }

        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "result" => null));
        break;
                
    case 'POST':
error_log("got into admin-manage-studies - POST");
        $error = false;
        $errorMsg = "";
        $studyRecord = null;
        $conditionGroupPhase = null;

        // get the type of POST operation
        $postTypeIn = cleanInputPost('postType');
        if (empty($postTypeIn)) {
            $error = true;
            $errorMsg .= 'Missing POST type. ';
        }
        $studyIDIn = cleanInputPost('studyID');
        if (empty($studyIDIn)) {
            $error = true;
            $errorMsg .= 'Missing study ID. ';
        }
        
        // check if a Tab needs to be added. If so, get the Study record to determine the 
        // condition group number and the number of phase that need to create new records in the 
        // conditionGroupPhaseTable table.
        if (!$error) {
            $studyRecord = getStudy($studyIDIn);
            if ($studyRecord == null) {
                $error = true;
                $errorMsg .= 'No study found. ';
            }
            else {
                $maxConditionGroupNum = $studyRecord["maxConditionGroupNum"] + 1;
                $conditionGroups = $studyRecord["conditionGroups"];
                $phases = $studyRecord["phases"];
                if ($conditionGroups >= 6) {
                    $error = true;
                    $errorMsg .= 'Error, maximum number of supported condition groups is 6. ';
                }
            }
        }

        if (!$error) {
            for ($ph = 1; !$error && $ph <= $phases; $ph++) {
                $newConditionGroupPhase = createConditionGroupPhase($studyIDIn, $maxConditionGroupNum, $ph, 0, 0, "0000000000001", 0, 0, 0);
                if ($newConditionGroupPhase == null) {
                    $error = true;
                    $errorMsg .= 'Database error: Could not create condition group phase record. ';
                } 
            }
            
            // update fields in the studyRecord to reflect new condition group
            if (!operateStudyTable($studyIDIn, "incr_conditionGroups")){
                $error = true;
                $errorMsg .= 'Database error: could not increment condition group in study. ';
            } 
            if (!operateStudyTable($studyIDIn, "incr_maxConditionGroupNum")){
                $error = true;
                $errorMsg .= 'Database error: could not increment maximum condition group number in study. ';
            } 
            
            $conditionGroupPhase = getAdminConditionGroupPhase($adminID);
            if ($conditionGroupPhase == null) {
                $error = true;
                $errorMsg .= ' Database error accessing conditionGroupTable. ';
            }
        }

        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "conditionGroupPhase" => $conditionGroupPhase));
        break;
        
    case 'DELETE':                           
error_log("got into admin-manage-studies - DELETE: ".$_SERVER['QUERY_STRING']);
        $error = false;
        $conditionGroupPhaseRecords = null;
        $conditionGroupPhase = null;
        $errorMsg = '';
        $deleteTypeIn = '';

        // TODO:
        // get user parameters/prevent sql injections/clear user invalid input
        parse_str($_SERVER['QUERY_STRING'], $query_params);
        if (!isset($query_params['deleteType'])) {
            $error = true;
            $errorMsg = 'Unknown PUT function.';
        }
        else 
            $deleteTypeIn = cleanInputPut($query_params['deleteType']);

        // try to delete a study. 
        //     - delete the study (studyID) in the studyTable
        //     - delete all users in the study (studyID) found in the userTable
        //     - delete all records of the study (studyID) found in the adminStudiesTable
        //     - delete all records of the study (studyID) found in the conditionGroupPhaseTable
        //     - delete all records of users (userID) in the study found in the dailyEntriesTable
        //     - delete all records of the study (studyID) in the postTable
        if (!$error && $deleteTypeIn == "study") {
            $studyIDIn = cleanInputPut($query_params['studyID']);
            if (empty($studyIDIn)) {
                $error = true;
                $errorMsg .= ' Study ID missing.';
            }
            
            // attempt delete
            if (!$error) {
                if (!deleteStudy($studyIDIn)) {
                    $error = true;
                    $errorMsg .= ' Database error: Could not delete study '.$studyIDIn;
                } 
            }
        }

        // try to delete a condition group. Only delete a condition group if 
        //     1) there is more than one condition group remaining
        //     2) the condition group is in the study
        //     3) if none of the phases in the conditional group has started
        if (!$error && $deleteTypeIn == "conditionGroup") {
            $studyIDIn = cleanInputPut($query_params['studyID']);
            $conditionGroupNumIn = cleanInputPut($query_params['conditionGroup']);
            if (empty($studyIDIn)) {
                $error = true;
                $errorMsg .= ' Study ID missing.';
            }
            if (empty($conditionGroupNumIn)) {
                $error = true;
                $errorMsg .= ' Condition Group missing.';
            }

            if (!$error) {
                $conditionGroupPhaseRecords = getConditionGroupPhases($studyIDIn, $conditionGroupNumIn);
                if ($conditionGroupPhaseRecords == null) {
                    $error = true;
                    $errorMsg .= ' Database error: No study or condition groups found';
                } 
                else {
                    $conditionalGroupExists = false;
                    $phaseStarted = false;
                    foreach ($conditionGroupPhaseRecords as $cgR) {
                        if ($cgR["conditionGroupNum"] == $conditionGroupNumIn) 
                            $conditionalGroupExists = true;
                        if ($cgR["phaseStarted"] == true) 
                            $phaseStarted = true;
                    }
                    if (!$conditionalGroupExists) {
                        $error = true;
                        $errorMsg .= ' Condition Group does not exist.';
                    }
                    else if (!$conditionalGroupExists) {
                        $error = true;
                        $errorMsg .= ' Cannot delete. One or more phases already started.';
                    } 
                    else if (operateStudyTable($studyIDIn, "equal1_conditionGroups")){
                        $error = true;
                        $errorMsg .= ' Cannot delete last condition group in study.';
                    } 
                    else {
                        $success1 = deleteConditionGroupPhase($studyIDIn, $conditionGroupNumIn);
                        $success2 = operateStudyTable($studyIDIn, "decr_conditionGroups");
                        if (!$success1 || !$success2) {
                            $error = true;
                            $errorMsg .= 'Database error: Could not delete condition group or decrement number of condition groups.';
                        } else {
                            // get the condition group phase records to display
                            $errorMsg .= 'Condition Group deleted.';
                            $conditionGroupPhase = getAdminConditionGroupPhase($adminID);
                            if ($conditionGroupPhase == null) {
                                $error = true;
                                $errorMsg .= 'Database error accessing conditionGroupTable';
                            }
                        }                        
                    }
                }
            }
        }       
        
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "conditionGroupPhase" => $conditionGroupPhase));
                        
        break;
        
    default:
        http_response_code(404);
        echo "Error: Unrecognised request.";
        echo json_encode(array(
                  "error" => true,
                  "errorMsg" => "Error: Unrecognised request."));
        break;
}


