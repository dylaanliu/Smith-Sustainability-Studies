<?php
// THIS IS JUST A FAKED OUT REST API CONTROLLER ON THE SERVER SIDE. IT IS MISSING A LOT INCLUDING
// AUTHENTICATION and SECURITY (SQLi, XSS, CFRF). IN ADDITION, THERE IS NO SERVER SIDE INPUT VALIDATION.
// OTHER POSSIBLE MISSING FEATURES ARE:
//     No related data (automatic joins) supported
//     No condensed JSON output supported
//     No support for PostgreSQL or SQL Server
//     No POST parameter support
//     No JSONP/CORS cross domain support
//     No base64 binary column support
//     No permission system
//     No search/filter support
//     No pagination or sorting supported
//     No column selection supported
// SEE
// https://www.leaseweb.com/labs/2015/10/creating-a-simple-rest-api-in-php/

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE

// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    $adminID = $_GET["q"];                                     // adminID is not required as a parameter. The ID of the user will be from the session and will have to be validated.
                                                               // It is only provided as an example since u will have to provide parameters from the client to the server in AJAX calls for other controllers    
    $studies = getAdminStudies($adminID);
    header('Content-type: application/json');
    echo $studies;
    break;
  case 'PUT':                              // not required in this controller
  case 'POST':                             // not required in this controller
  case 'DELETE':                           // not required in this controller
  default:
    http_response_code(404);
    // really also want to pass a message back to the client to indicate what the error was
    break;
}

// When implemented . . . 
// This function will need to access the "adminStudiesTable" first to get the studies associated with
// an admin. Then it will have to access the "studyTable" to get the records of interest. A JOIN would 
// probably make the SQL queries easier.
//
// At present, a static JSON object string. Other options that could be returned are arrays of arrays of name value pairs. This needs to be
// decided. The easiest is a JSON object but certainly it maynot be the most logical for the model to return.
function getAdminStudies($adminID) {
    
    return 
    '{"Studies": [
		{"studyId":"1",   "adminID":"1", "title":"Effect of Social Media", "description":"my description text",
             "conditionGroups":"3", "phases":"4", "startDate":"2016-01-12", "endDate":"2017-02-28"},
		{"studyId":"2",   "adminID":"1", "title":"Effect of Sunshine and Rainbows", "description":"description text2",
             "conditionGroups":"3", "phases":"4", "startDate":"2017-01-01", "endDate":"2017-12-01"},
		{"studyId":"3",   "adminID":"1", "title":"Effect of Bacon", "description":"description text3",
             "conditionGroups":"3", "phases":"4", "startDate":"2016-12-24", "endDate":"2017-01-24"},
		{"studyId":"7",   "adminID":"1", "title":"Dangers of Cute Cat Videos", "description":"Studies the detrimental effects of cute cat videos on the study habits of collage students.",
             "conditionGroups":"3", "phases":"4", "startDate":"2016-12-24", "endDate":"2017-01-24"},
		{"studyId":"130", "adminID":"1", "title":"Pigs can Fly", "description":"Determines if the flagellating frequency of a pig affects its ability to fly",
             "conditionGroups":"3", "phases":"4", "startDate":"2016-12-24", "endDate":"2017-01-24"},
		{"studyId":"300", "adminID":"1", "title":"TWD and Smurf collecting", "description":"Measures the tendency of kids who collect Smurfs relative to their grown up need for Total World Domination",
             "conditionGroups":"3", "phases":"4", "startDate":"2016-12-24", "endDate":"2017-01-24"},
		{"studyId":"321", "adminID":"1", "title":"Walking and Health", "description":"Examines if increase hours of watching the Walking Dead leads to a more healthy life style.",
             "conditionGroups":"3", "phases":"4", "startDate":"2016-12-24", "endDate":"2017-01-24"}
	]}';    
}


 
