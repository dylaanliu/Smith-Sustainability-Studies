<?php

// gets a user input parameter from $_GET and cleans it up (sql injections, leading/lagging spaces, etc)
function cleanInputGet($paramName) { 
    $paramIn = isset($_GET[$paramName]) ? trim($_GET[$paramName]) : ''; // Fetching Values from URL.
    $paramIn = strip_tags($paramIn);
    $paramIn = htmlspecialchars($paramIn);
    
    return $paramIn;
}


// gets a user input parameter from $_POST and cleans it up (sql injections, leading/lagging spaces, etc)
function cleanInputPost($paramName) { 
    $paramIn = isset($_POST[$paramName]) ? trim($_POST[$paramName]) : ''; // Fetching Values from URL.
    $paramIn = strip_tags($paramIn);
    $paramIn = htmlspecialchars($paramIn);
    
    return $paramIn;
}


// gets a user input parameter from $_GET and cleans it up (sql injections, leading/lagging spaces, etc)
function cleanInputPut($paramIn) { 
    $paramIn = strip_tags($paramIn);
    $paramIn = htmlspecialchars($paramIn);
    
    return $paramIn;
}

// user to authenticate if a user has the rights to access a page
// TODO - need to debug and perhaps enhance
function authenticate($privilegeLevel) {
    //first check whether session is set and if the user has privilage for the page
/*     if(!isset($_SESSION['userID']) || $privilegeLevel != $_SESSION['privilegeLevel']) {
        return false;
    }
 */    
     return true;
}
