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
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE
error_log('hello php1',0);
error_log($method,0);    
//$userInfo = ""; // global var for user info

// create SQL based on HTTP method
switch ($method) {
  case 'GET':

    $userData = getUser("fakeUserID");
//error_log('hello php2',0);
    header('Content-type: application/json');
    echo $userData;
//error_log($incompleteEntries,0);
    break;
  case 'PUT':
  error_log('hello php2',0);
    parse_str(file_get_contents("php://input"), $put_vars);
    $userID = "1"; // get from SESSION
    $toUpdate = array("entryID" => $userID);
    $userName = $put_vars["userName1"];
    if ($userName != null) {
      $toUpdate["userName"] = $userName;
    } 
    $password = $put_vars["password1"];
    if ($password != "") {
      $toUpdate["encodedPW"] = $startTime;
    } 
    $email = $put_vars["email1"];
    if ($email != "") {
      $toUpdate["email"] = $email;
    } 
    
  error_log(print_r($toUpdate, true), 0);
    $updatedData = updateDailyEntry($userID, $toUpdate);
  error_log(gettype($updatedData),0);
   header("Content-Type: application/json", true);

    echo $updatedData;
    //
    break;
  case 'POST':
    break;
  case 'DELETE':                           // not required in this controller
  default:
//error_log('hello php3',0);
    http_response_code(404);
    // really also want to pass a message back to the client to indicate what the error was
    break;
}


function updateProfile($userID, $userName, $toUpdate){
  // do update here
error_log("hello9", 0);

  $updatedData = json_encode($toUpdate);
  return $updatedData;
 
}

function getUser($userID) {
    return
    '{"User":[
      {"userId":"1", "encodedPW":"Axhy1sh", "firstName":"Amy", "lastName":"Schumer", "email":"amy_schumer@gmail.com", "privilegeLevel":"user", "studyId":"1", "CurrentConditionGroup":"1", "currentPhase": "2"}
      ]}';

      //return $userInfo;
 
}

?>

 
