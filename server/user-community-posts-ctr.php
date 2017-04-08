<?php
// load file to authenticate user and then determine if the authenticated user has permission to access this page
require_once 'utils/authenticateUser.php';
verifyUserPrivilage('user');

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE
// $userID = '1';
$userID = $_SESSION['userID'];


// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    $error = false;
    $errorMsg = "No Error";

    //error_log("getting condition group posts");
    $conditionGroupNum = cleanInputGet("conditionGroupNum");
    $studyID = cleanInputGet("studyID");
    $phaseNum = cleanInputGet("currentPhase");
    $conditionGroupPosts = getUserPostsByPermission($userID, $studyID, $conditionGroupNum, $phaseNum);
    //error_log(print_r($conditionGroupPosts, true), 0);
    header('Content-type: application/json');
    

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

  case 'PUT':
    //error_log("put, incr/decr like");
    $error = false;
    $errorMsg = "No Error";
    $phaseUpdated = false;
    parse_str(file_get_contents("php://input"), $put_vars);


    $cmdIn = cleanInputPut($put_vars['cmd']);
    if (!operateUserTable($userID, $cmdIn, "likesNumPhase") || !operateUserTable($userID, $cmdIn, "likesNumTotal")) {
      $error = true;
      $errorMsg = "Database Error: Could not like Post";
    } 
    else {
        if ($cmdIn == 'incr')
            $phaseUpdated = updatePhase($userID);
    }

    echo json_encode(array(
          "error" => $error,
          "errorMsg" => $errorMsg));
    
    break;
  case 'POST':
  //error_log("Posting new post");
    $error = false;
    $errorMsg = "";

    date_default_timezone_set('America/Toronto');
    $dateTimeStamp = date('Y-m-d H:i:s'); // when the study is made active
    $postText = cleanInputPost("text1");
    $image = cleanInputPost("image1");
    $conditionGroupNum = cleanInputPost("conditionGroupNum1");
    $phaseNum = cleanInputPost("phaseNum1");
    $studyID = cleanInputPost("studyID1");
    
//error_log("postText=".$postText." conditionGroupNum=".$conditionGroupNum." PhaseNum=".$phaseNum);
/*    $success = createPost($userID, $dateTimeStamp, $text, $image, $conditionGroupNum, $phaseNum, $studyID);
    error_log("succeeded");
    echo $success;*/
    if (empty($postText)) {
        $error = true;
        $errorMsg .= 'Text is required. ';
    }
    if (empty($conditionGroupNum)) {
        $error = true;
        $errorMsg .= 'condition group required. ';
    }
    if (empty($phaseNum)) {
        $error = true;
        $errorMsg .= 'phase required. ';
    }

    if(!$error) {
        // TODO - last parameter is adminID which should be from the $_SESSION 
        //$userRecords = createUser($userNameIn, $firstNameIn, $lastNameIn, $passwordIn, 'user', $_SESSION['userID']);
        $postRecord = createPost($userID, $dateTimeStamp, $postText, $image, $conditionGroupNum, $phaseNum, $studyID);  

        if (!operateUserTable($userID, "incr", "postsNumPhase") || !operateUserTable($userID, "incr", "postsNumTotal")) {
          $error = true;
          $errorMsg .= "Database Error: Could not like Post ";
        } 
        else {
            $phaseUpdated = updatePhase($userID);
        }
        
        
        if ($postRecord == null) {
            $error = true;
            $errorMsg .= 'Database error: Could not create post ';
        }  else {
          $errorMsg = 'Post Created';
        }
    }
    else {
        $errorMsg = 'No error.';        
    }

    echo json_encode(array(
              "error" => $error,
              "errorMsg" => $errorMsg,
              "data" => $postRecord));


    break;
  case 'DELETE':                           // not required in this controller
  default:
    $error = false;
    $errorMsg = "No Error";

    http_response_code(404);
    // really also want to pass a message back to the client to indicate what the error was
    break;
}
?>

 
