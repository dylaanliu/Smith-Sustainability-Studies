<?php
// start a session to determine if there is currently a session. In addition, establish connection
// to the database.
session_start();
require_once 'utils/utils.php';
require_once 'model.php';
$error = false;

// TODO : if session is set already, do not allow re-validation. Go to admin or user home. 
 if (isset($_SESSION['userName']) != "" ) {
     // COMMENTED OUT FOR TESTING
        // echo json_encode(array(
            // "error" => true,
            // "errorMsg" => "Error: Already logged in. Please log out first",
            // "redirect" => ""));
        // exit;
}

 
// prevent sql injections/clear user invalid inputs
$usernameIn = cleanInputPost('username1');        // Fetching Values from URL.
if (empty($usernameIn))
    $error = true;

$passwordIn = cleanInputPost('password1');        // Fetching Values from URL.
if (empty($passwordIn))
    $error = true;

if (!$error) {
    // if password is correct, save session information and send JSON data to 
    // client to 
    $userRecord = validateUser($usernameIn, $passwordIn); 
    if ($userRecord != null) {

        // remember user info for the session
        $_SESSION['userID'] = $userRecord['userID'];
        $_SESSION['userName'] = $userRecord['userName'];
        $_SESSION['privilegeLevel'] = $userRecord['privilegeLevel'];
        $_SESSION['studyID'] = $userRecord['studyID'];
        $_SESSION['currentConditionGroup'] = $userRecord['currentConditionGroup'];
        $_SESSION['currentPhase'] = $userRecord['currentPhase'];
        $_SESSION['teamNum'] = $userRecord['teamNum'];
error_log("index - SESSION userID = ".$_SESSION['userID']);
                
        // setup values for client
        $errorMsg = "Successfully Logged in...";
        if ($userRecord['privilegeLevel'] == "admin" || $userRecord['privilegeLevel'] == "super_admin") {
            $redirect = dirname(dirname($_SERVER['REQUEST_URI']))."/admin-template.html";
        } else {
            $redirect = dirname(dirname($_SERVER['REQUEST_URI']))."/user-template.html";
        }
    } else {
        $error = true;
        $errorMsg = "Username or Password is wrong...!!!!";
    }    

    echo json_encode(array(
        "error" => $error,
        "errorMsg" => $errorMsg, 
        "redirect" => $redirect,
        "userID" => $userRecord['userID'],
        "userName" => $userRecord['userName'],
        "studyID" => $userRecord['studyID'],
        "currentConditionGroup" => $userRecord['currentConditionGroup'],
        "currentPhase" => $userRecord['currentPhase'],
        "teamNum" => $userRecord['teamNum'] 
    ));
}
        
?>

