<?php
/*
THIS IS JUST A FAKED OUT REST API CONTROLLER ON THE SERVER SIDE. IT IS MISSING A LOT INCLUDING
AUTHENTICATION and SECURITY (SQLi, XSS, CFRF). IN ADDITION, THERE IS NO SERVER SIDE INPUT VALIDATION.
OTHER POSSIBLE MISSING FEATURES ARE:
    No related data (automatic joins) supported
    No condensed JSON output supported
    No support for PostgreSQL or SQL Server
    No POST parameter support
    No JSONP/CORS cross domain support
    No base64 binary column support
    No permission system
    No search/filter support
    No pagination or sorting supported
    No column selection supported
SEE
https://www.leaseweb.com/labs/2015/10/creating-a-simple-rest-api-in-php/  
*/

require_once 'utils/utils.php';
require_once 'model.php';

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];    
//$permissions = "1111110111111";                             // GET,POST,PUT,DELETE
error_log('hello php1',0);
error_log($method,0);    
//$userInfo = ""; // global var for user info

// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    error_log("getting condition group posts");
    $conditionGroupNum = cleanInputGet("conditionGroupNum");
    $studyID = cleanInputGet("studyID");
    $phaseNum = cleanInputGet("currentPhase");
    $conditionGroupPosts = getUserPostsCG($studyID, $conditionGroupNum, $phaseNum);
    error_log(print_r($conditionGroupPosts, true), 0);
    header('Content-type: application/json');
    
      $error = false;
    
    if ( $conditionGroupPosts == null ) {
      $error = true;
      $errorMsg = "Failed to retrieve condition group posts";
    }
    else {
      $errorMsg = "Successfully retrieved condition group posts";
    }
      
    echo json_encode(array(
          "error" => $error,
          "errorMsg" => $errorMsg, 
          "posts" => $conditionGroupPosts));
    
      //echo $conditionGroupPosts;
    break;

  case 'PUT': // not required int this controller
    break;
  case 'POST':
  error_log("Posting new post");
    $error = false;
    $userID = isset($_SESSION['userID']) ? $_SESSION['userID'] : "13";  // TODO - used to debug. 
    date_default_timezone_set('America/Toronto');
    $dateTimeStamp = date('Y-m-d H:i:s'); // when the study is made active
    $postText = cleanInputPost("text1");
    $image = cleanInputPost("image1");
    $conditionGroupNum = cleanInputPost("conditionGroupNum1");
    $phaseNum = cleanInputPost("phaseNum1");
    $studyID = cleanInputPost("studyID1");

/*    $success = createPost($userID, $dateTimeStamp, $text, $image, $conditionGroupNum, $phaseNum, $studyID);
    error_log("succeeded");
    echo $success;*/
    if (empty($postText)) {
        $error = true;
        $errorMsg = 'Text is required.';
    }
    if (empty($conditionGroupNum)) {
        $error = true;
        $errorMsg = 'condition group required.';
    }
    if (empty($phaseNum)) {
        $error = true;
        $errorMsg = 'phase required.';
    }

    if(!$error) {
        // TODO - last parameter is adminID which should be from the $_SESSION 
        //$userRecords = createUser($userNameIn, $firstNameIn, $lastNameIn, $passwordIn, 'user', $_SESSION['userID']);
        $postRecord = createPost($userID, $dateTimeStamp, $postText, $image, $conditionGroupNum, $phaseNum, $studyID);  
        
        if ($postRecord == null) {
            $error = true;
            $errorMsg = 'Database error: Could not create post';
        }  else {
          $errorMsg = 'Post Created';
        }
    }

    echo json_encode(array(
              "error" => $error,
              "errorMsg" => $errorMsg,
              "data" => $postRecord));


    break;
  case 'DELETE':                           // not required in this controller
  default:
    http_response_code(404);
    // really also want to pass a message back to the client to indicate what the error was
    break;
}
?>

 
