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

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE

//$userInfo = ""; // global var for user info

// create SQL based on HTTP method
switch ($method) {
  case 'GET':

/*  adminID is not required as a parameter. 
    The ID of the user will be from the session and will have to be validated.
    It is only provided as an example since we will have to provide parameters 
    from the client to the server in AJAX calls for other controllers */ 

    // need to check if this exists: ISSET?
    if(!isset($_GET["q"])) {
      htpp_response_code(500);
    }

    $queryType = $_GET["q"]; // don't need userID, as will use $_SESSION
    switch ($queryType) {
      case "user":
        // need to check for error fromgetUser if the query was not succesfful
        $userInfo = getUser("fakeUserID");
        header('Content-type: application/json');
        echo $userInfo;

        break;
      case "condition_group_phase":
        $studyID = $_GET["studyId"];
        $conditionGroupNum = $_GET["CurrentConditionGroup"];
        $phaseNum = $_GET["currentPhase"];
        $conditionGroupPhaseInfo = getConditionGroupPhase($studyID, $conditionGroupNum, $phaseNum);
        header('Content-type: application/json');
        echo $conditionGroupPhaseInfo;
        break;
      case "rewards":
        break;
    }

    break;
  case 'PUT':                              // not required in this controller
  case 'POST':                             // not required in this controller
  case 'DELETE':                           // not required in this controller
  default:
    http_response_code(404);
    // really also want to pass a message back to the client to indicate what the error was
    break;
}

/*When implemented . . . 
This function will need to access the "adminStudiesTable" first to get the studies associated with an admin. 
Then it will have to access the "studyTable" to get the records of interest. A JOIN would 
probably make the SQL queries easier.

At present, a static JSON object string. BE needs to return a JSON object (sorted by id) string
This function should also be in a separate PHP file with all the other functions as per the Data Design*/
function getUser($userID) {
    return
    '{"User":[
      {"userId":"1", "encodedPW":"Axhy1sh", "firstName":"Amy", "lastName":"Schumer", "privilegeLevel":"user", "studyId":"1", "CurrentConditionGroup":"1", "currentPhase": "2"}
      ]}';

      //return $userInfo;
 
}

function getConditionGroupPhase($studyID, $cgNum, $phaseNum) {
        return 
    '{"ConditionGroupPhase":[
      {"ID":"2", "studyId":"1", "conditionGroupNum":"1", "phaseNum":"2", "phaseStarted":"True", "phaseEnded":"False", "phasePermission":"0110110000011", "entriesNum": "10", "postsNum":"5", "likesNum":"5"}
      ]}';
}

/* TODO: fill in for rewards
function getRewards($userId) {

}*/
?>

 
