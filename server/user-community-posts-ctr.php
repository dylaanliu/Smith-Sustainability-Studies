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
$permissions = "1111110111111";                             // GET,POST,PUT,DELETE
error_log('hello php1',0);
error_log($method,0);    
//$userInfo = ""; // global var for user info

// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    error_log("getting condition group posts");
      $userID = $_SESSION['userID'];
	  $conditionGroupNum = $_SESSION["currentConditionGroup"];
      $conditionGroupPosts = getUserPostsCG($userID, $conditionGroupNum);
    error_log(print_r($conditionGroupPosts, true), 0);
      header('Content-type: application/json');
	  
	  	// $error = false;
		
		// if ( $conditionGroupPosts == null ) {
			// $error = true;
			// $errorMsg = "Failed to retrieve condition group posts";
		// }
		// else {
			// $errorMsg = "Successfully retrieved condition group posts";
		// }
			
		// echo json_encode(array(
					// "error" => $error,
					// "errorMsg" => $errorMsg, 
					// "posts" => $conditionGroupPosts));
	  
      echo $conditionGroupPosts;
      break;

  case 'PUT': // not required int this controller
    break;
  case 'POST':
  error_log("Posting new post");
    $userID = $_SESSION['userID']; // get from SESSIONS
    $dateTime = cleanInputGet($_POST["dateTime1"]);
    $text = cleanInputGet($_POST["text1"]);
    $image = cleanInputGet($_POST["image1"]);
    $conditionGroupNum = cleanInputGet($_POST["conditionGroupNum1"]);
    $phaseNum = cleanInputGet($_POST["phaseNum1"]);

    $success = createPost($userID, $dateTime, $text, $image, $conditionGroupNum, $phaseNum);
    error_log("succeeded");
	
	// $error = false;
	
	// if ( $success == null ) {
		// $error = true;
		// $errorMsg = "Failed to create post";
	// }
	// else {
		// $errorMsg = "Successfully created post";
	// }
		
	// echo json_encode(array(
				// "error" => $error,
				// "errorMsg" => $errorMsg, 
				// "post" => $success));
					
    echo $success;

    break;
  case 'DELETE':                           // not required in this controller
  default:
    http_response_code(404);
    // really also want to pass a message back to the client to indicate what the error was
    break;
}


/*function getUserPosts($userID) {
 /* do a join of posts table & user table to get username for post:
    ex: SELECT Posts.postId, Posts.userId, Users.username, Posts.dateTime,
               Posts.text, Posts.image, Posts.conditionGroupNum, Posts.phaseNum
        FROM Posts
        INNER JOIN Users
        ON Posts.userId = Users.userId

  function determines which posts the user can see based on permissions
      

    return
    '{"Posts":[
    {"postId":"1", 
      "userId":"1", 
      "username":"amy123",
      "dateTime":"2016-12-24 17:45:12",
      "text":"this is sample text 1", 
      "image":"",  
      "conditionGroupNum":"1", 
      "phaseNum":"2"},
    {"postId":"2", 
      "userId":"2", 
      "username":"bob456",
      "dateTime":"2016-12-24 13:45:12",
      "text":"this is sample text 2", 
      "image":"",  
      "conditionGroupNum":"1", 
      "phaseNum":"2"},
    {"postId":"3", 
      "userId":"3",
      "username": "cathy789", 
      "dateTime":"2016-12-20 17:45:12",
      "text":"this is sample text 3 it is meant to be very long to show text wrap within this box. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", 
      "image":"",  
      "conditionGroupNum":"1", 
      "phaseNum":"2"}
      ]}';

      //return $userInfo;
 
}*/

/*function createPost($userID, $dateTime, $text, $image, $conditionGroupNum, $phaseNum) {
  error_log("creating post", 0);
  $newPostData = array("userID" => $userID,
                        "dateTime" => $dateTime,
                        "text" => $text,
                        "image" => $image,
                        "conditionGroupNum" => $conditionGroupNum,
                        "phaseNum" => $phaseNum);
  error_log(print_r($newPostData, true), 0);

// do CREATE here
  return true;
}*/

?>

 
