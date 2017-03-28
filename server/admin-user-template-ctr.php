<?php  

// load file to authenticate user and then determine if the authenticated user has permission to access this page
require_once 'utils/authenticateUser.php';
verifyUserPrivilage('user');

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];               
error_log("SESSION userID = ".$_SESSION['userID']);

switch ($method) {
    case 'GET':
error_log("got into logout - GET");
        $q = cleanInputGet('q');

        // set session data to empty and destroy session. 
        $_SESSION = array(); 
        session_destroy(); 
        
        // Double check to see if their sessions exists 
        if(isset($_SESSION['userID'])){ 
            echo json_encode(array(
                      "error" => true,
                      "errorMsg" => "Logout Unsuccessful"
                      ));
        } 
        else { 
            echo json_encode(array(
                      "error" => false,
                      "errorMsg" => "Logout Successful",
                      "redirect" => dirname(dirname($_SERVER['REQUEST_URI']))."/index.html"
                      ));
        }
        break;

    case 'PUT':
    case 'POST':
    case 'DELETE':
    default:
        http_response_code(404);
        // really also want to pass a message back to the client to indicate what the error was
    break;
}

?>  