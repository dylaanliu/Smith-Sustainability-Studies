<?php
// start a session to determine if there is currently a session. In addition, establish connection
// to the database.
session_start();
require_once 'utils/utils.php';
require_once 'model.php';
$error = false;

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
        $_SESSION['encodedPW'] = $userRecord['encodedPW'];
        $_SESSION['privilegeLevel'] = $userRecord['privilegeLevel'];
        $_SESSION['studyID'] = $userRecord['studyID'];
        $_SESSION['currentConditionGroup'] = $userRecord['currentConditionGroup'];
        $_SESSION['currentPhase'] = $userRecord['currentPhase'];
        $_SESSION['teamNum'] = $userRecord['teamNum'];
                
        // setup values for client
        $errorMsg = "Successfully Logged in...";
        if ($userRecord['privilegeLevel'] == "admin" || $userRecord['privilegeLevel'] == "super_admin") {
            $redirect = dirname(dirname($_SERVER['REQUEST_URI']))."/admin-template.html";
        } else {
            $redirect = dirname(dirname($_SERVER['REQUEST_URI']))."/user-template.html";
        }
        
        // create cookies if remember me is set else destroy previous cookies
        if (isset($_POST['remember'])) {
            setcookie("userID", $userRecord['userID'], strtotime( '+1 days' ), "/", "", "", TRUE); 
            setcookie("privilegeLevel", $userRecord['privilegeLevel'], strtotime( '+1 days' ), "/", "", "", TRUE); 
            setcookie("encodedPW", $userRecord['encodedPW'], strtotime( '+1 days' ), "/", "", "", TRUE);
        }
        else {
            setcookie("userID", '', time() - 1*24*60*60); 
            setcookie("privilegeLevel", '', time() - 1*24*60*60); 
            setcookie("encodedPW", '', time() - 1*24*60*60);
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

