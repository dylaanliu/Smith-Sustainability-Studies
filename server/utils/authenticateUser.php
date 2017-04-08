<?php
// Files that include this file at the very top would NOT require 
// connection to database or session_start(), be careful. 
 
session_start(); 
require_once 'utils.php';
require_once __DIR__.'/../model.php';

// Files that include this file at the very top would NOT require 
// connection to database or session_start(), be careful. 

// Initialize some vars 
$user_ok = false; 
$user_authorized = false; 
$log_userID = ""; 
$log_privilegeLevel = ""; 
$log_encodedPW = ""; 


// User Verify function based on privilege
function verifyUserPrivilage($pagePrivilage) { 
    global $log_privilegeLevel;
    if (($pagePrivilage == "super_admin" && $log_privilegeLevel == "super_admin") || 
        ($pagePrivilage == "admin" && ($log_privilegeLevel == "super_admin" || $log_privilegeLevel == "admin")) ||
        ($pagePrivilage == "user" && ($log_privilegeLevel == "super_admin" || $log_privilegeLevel == "admin" || $log_privilegeLevel == "user"))
       ) {
        $user_authorized = true; 
    }
    else {
error_log("pagePrivilage=".$pagePrivilage);
error_log("log_privilegeLevel=".$log_privilegeLevel);
        header('HTTP/1.0 403 Forbidden: Not Authorized');
        header('location:index.html');
        echo 'You are forbidden!';
        die();        
    }
} 

if(isset($_SESSION["userID"]) && isset($_SESSION["privilegeLevel"]) && isset($_SESSION["encodedPW"])) { 
    $log_userID = preg_replace('#[^0-9]#', '', $_SESSION['userID']); 
    $log_privilegeLevel = preg_replace('#[^a-zA-Z_]#', '', $_SESSION['privilegeLevel']); 
    $log_encodedPW = preg_replace('#[^a-zA-Z0-9]#i', '', $_SESSION['encodedPW']); 
    
    $user_ok = true; 
} 
else if(isset($_COOKIE["userID"]) && isset($_COOKIE["privilegeLevel"]) && isset($_COOKIE["encodedPW"])) { 
    $_SESSION['userid'] = preg_replace('#[^0-9]#', '', $_COOKIE['userID']); 
    
    $userRecord = getUser($_SESSION['userid'], false); 
    if ($userRecord != null && 
            $_COOKIE["privilegeLevel"] == $userRecord[0]['privilegeLevel'] &&
            $_COOKIE["encodedPW"] == $userRecord[0]['encodedPW']) {
                
        // remember user info for the session
        $_SESSION['userName'] = $userRecord[0]['userName'];
        $_SESSION['encodedPW'] = $userRecord[0]['encodedPW'];
        $_SESSION['privilegeLevel'] = $userRecord[0]['privilegeLevel'];
        $_SESSION['studyID'] = $userRecord[0]['studyID'];
        $_SESSION['currentConditionGroup'] = $userRecord[0]['currentConditionGroup'];
        $_SESSION['currentPhase'] = $userRecord[0]['currentPhase'];
        $_SESSION['teamNum'] = $userRecord[0]['teamNum'];
    }
    else {
        header('HTTP/1.0 403 Forbidden: Cookie Issue');
        echo 'You are forbidden!';
        die();                
    }
    $log_userID = $_SESSION['userID']; 
    $log_privilegeLevel = $_SESSION['privilegeLevel']; 
    $log_encodedPW = $_SESSION['encodedPW']; 

    $user_ok = true; 
} 

?>

