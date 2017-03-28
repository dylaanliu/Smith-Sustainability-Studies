<?php
// load file to authenticate user and then determine if the authenticated user has permission to access this page
require_once 'utils/authenticateUser.php';
verifyUserPrivilage('admin');

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE

error_log("got into admin-user-accounts. Method");
error_log($method);

// create SQL based on HTTP method
switch ($method) {
    case 'GET':
        $q = cleanInputGet('q');
        $userIDIn = cleanInputGet('userID');
        $userRecords = null;
        $error = false;
        if ($q === "getAllUsers") {
            // check if there was an error or nothing returned
            $userRecords = getAllUsers();
            if ($userRecords == null) {
                $error = true;
                $errorMsg = 'No user records found';
            }
            else
                $errorMsg = 'User records found';
        } 
        else if ($q === "getUser" && !empty($userIDIn)) { 
            $userRecords = getUser($userIDIn);
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
error_log("got into admin-user-accounts - PUT");
        $error = false;
        $userRecords = null;
        
        // get user parameters/prevent sql injections/clear user invalid input
        parse_str(file_get_contents("php://input"), $put_vars);
        $userIDIn = cleanInputPut($put_vars['userID']);
        $userNameIn = cleanInputPut($put_vars['userName']);
        $emailIn = cleanInputPut($put_vars['email']);
        $firstNameIn = cleanInputPut($put_vars['firstName']);
        $lastNameIn = cleanInputPut($put_vars['lastName']);          
        $studyIDIn = cleanInputPut($put_vars['studyID']);
        $currentConditionGroupIn = cleanInputPut($put_vars['currentConditionGroup']);  
        $currentPhaseIn = cleanInputPut($put_vars['currentPhase']); 
        $teamNumIn = cleanInputPut($put_vars['teamNum']);  
error_log($userIDIn);error_log($userNameIn);error_log($emailIn);

        // If the string is not empty, string should be validated.
        //
        // TODO:
        // Should really check all fields for validity (valid characters, email format, length, etc)
        // may want to force first character of first and last name to be upper case.
        if (empty($userIDIn)) {
            $error = true;
            $errorMsg = 'UserID is required.';
        }
        if (empty($userNameIn)) {
            $error = true;
            $errorMsg = 'User name is required.';
        }
 
        if (!$error) {
            $success = updateUser($userIDIn, $userNameIn, $firstNameIn, $lastNameIn, $emailIn, $studyIDIn, $currentConditionGroupIn, $currentPhaseIn, $teamNumIn);
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
                  "data" => $userRecords));
        break;
                
    case 'POST':
error_log("got into admin-user-accounts - POST");
        $error = false;
        $userRecords = null;
        
        // get user parameters/prevent sql injections/clear user invalid input
        $userNameIn = cleanInputPost('userName');
        $passwordIn = cleanInputPost('password'); 
        $emailIn = cleanInputPost('email');
        $firstNameIn = cleanInputPost('firstName');
        $lastNameIn = cleanInputPost('lastName');          
        $privilegeLevelIn = cleanInputPost('privilegeLevelSelector');  
        
        // basic input validation. 
        // TODO:
        // Should really check all fields for validity (valid characters, email format, length, etc)
        // may want to force first character of first and last name to be upper case
        if (empty($userNameIn)) {
            $error = true;
            $errorMsg = 'User name and password are required.';
        }
        if (empty($passwordIn)) {
            $error = true;
            $errorMsg = 'User name and password are required.';
        }
        // only super_admin's are allowed to create super_admin
        if($privilegeLevelIn == "super_admin" && $_SESSION['privilegeLevel'] != "super_admin") {
            $error = true;
            $errorMsg = 'You do not have privileges to create a super admin account.';
        }

        if (!$error) {
            // TODO - last parameter is adminID which should be from the $_SESSION 
            //$userRecords = createUser($userNameIn, $firstNameIn, $lastNameIn, $passwordIn, 'user', $_SESSION['userID']);
            $userRecords = createUser($userNameIn, $firstNameIn, $lastNameIn, $passwordIn, $emailIn, $privilegeLevelIn, '-1');
            if ($userRecords == null) {
                $error = true;
                $errorMsg = 'Database error: Could not create user: '.$userNameIn.', password: '.$passwordIn;
            } else {
                $errorMsg = 'User record created.';
            }
        }        
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "data" => $userRecords));
        break;
        
    case 'DELETE':                           
error_log("got into admin-user-accounts - DELETE");
        $error = false;
        // get parameters
        parse_str($_SERVER['QUERY_STRING'], $query_params);
        if (!isset($query_params['userID'])) {
            $error = true;
            $errorMsg = 'No user specified';
        }
        else if (!ctype_digit($query_params['userID'])){       // must be all digits
            $error = true;
            $errorMsg = 'Illegal user specified';
        }
        else {
            // check if there was an database error or nothing returned
            $userID = $query_params['userID'];
            
            if (!deleteUser($userID)) {
                $error = true;
                $errorMsg = 'No user  found';
            }
            else
                $errorMsg = 'User deleted';        
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


            
