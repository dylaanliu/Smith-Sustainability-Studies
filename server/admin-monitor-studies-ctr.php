<?php
session_start();
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

require_once 'utils/utils.php';
require_once 'model.php';

// only admins and super_admins are allowed to access this page
 if (!(authenticate("admin") || authenticate("admin"))) {
    header('HTTP/1.0 403 Forbidden');
    echo 'You are forbidden!';
    die();
}

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];                                 // GET,POST,PUT,DELETE

// TODO - TEMP just setting an admin ID that we know exists in the database. This should be 
// retrieved from the session if the user is validated and has permission to this page.
$adminID = '3';
    
// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    // need to check if this exists: ISSET?
    if(!isset($_GET["q"])) {
      htpp_response_code(500);
    }

    $queryType = $_GET["q"]; // don't need userID, as will use $_SESSION
    switch ($queryType) {
      case 'get_admin_studies':
        $error = false;
        $studies = getAdminStudies($adminID);
      //error_log(print_r($studies, true), 0);
        if ($studies == null) {
            $error = true;
            $errorMsg = 'No studies found';
            error_log("some error", 0);
        }
        else
            $errorMsg = 'Admin studies found';
        error_log("through", 0);
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "data" => $studies));
        break;
      case 'get_study_data':
          $error = false;
          $studies = null;
          $conditionGroupPhase = null;
          $posts = null;

          $studyIDIn = cleanInputGet('studyID');
          if (empty($studyIDIn)) {
              $error = true;
              $errorMsg = 'Expecting studyID';
          }
          
          $studies = getAdminStudies($adminID);
          if ($studies == null) {
              $error = true;
              $errorMsg = 'No studies found';
          }
          else {
              $errorMsg = 'Admin studies found.';

              $conditionGroupPhase = getAdminConditionGroupPhase($adminID);
              if ($conditionGroupPhase == null) {
                  $error = true;
                  $errorMsg = 'Database error accessing conditionGroupTable';
              }
              else {
                  $posts = getStudyPosts($studyIDIn);
                  if ($posts == null) {
                      $error = true;
                      $errorMsg = 'Database error accessing postTable';
                  }
              }
          }
          
          echo json_encode(array(
                    "error" => $error,
                    "errorMsg" => $errorMsg, 
                    "studies" => $studies,
                    "conditionGroupPhase" => $conditionGroupPhase,
                    "posts" => $posts));
          break;
      case 'get_single_study_data':
        $error = false;
        $studyID = $_GET["studyID"];
        $study = getStudy($studyID);
        $conditionGroupPhase = getAdminConditionGroupPhase($adminID);
        
        if ($study == null || $conditionGroupPhase == null) {
            $error = true;
            $errorMsg = 'No study or condition group phase found';
            error_log("some error", 0);
        }
        else
            $errorMsg = 'Study and condition group phase found';
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "study" => $study,
                  "conditionGroupPhase" => $conditionGroupPhase));
        error_log("returned from study: ",0);
        error_log(print_r($study, true),0);
        break;
      case 'get_posts':
        error_log("GET posts - admin monitor studies",0);
        $error = false;
        $studyID = cleanInputGet("studyID");
        $conditionGroup = cleanInputGet("conditionGroup");
        $phaseNum = cleanInputGet("phaseNum");
        $posts = getPostCGPhase($studyID, $conditionGroup, $phaseNum);
        if ($posts == null) {
            $error = true;
            $errorMsg = 'No post found';
            error_log("some error", 0);
        }
        else
            $errorMsg = 'Posts found';
        error_log("before echo", 0);
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "data" => $posts));
        error_log("after echoed",0);
        break;
      case 'get_results':
        error_log("GET daily entries - admin monitor studies", 0);
        $error = false;
        $studyID = cleanInputGet("studyID");
        $dailyEntries = getStudyDailyEntries($studyID);
        if ($dailyEntries == null) {
            $error = true;
            $errorMsg = 'No Daily Entries found';
            error_log("some error", 0);
        }
        else
            $errorMsg = 'Daily Entries found';
        //error_log("before echo", 0);
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg, 
                  "data" => $dailyEntries));
        //error_log("after echoed",0);
    }

    break;
  case 'PUT':                              // not required in this controller
  case 'POST':
    error_log("Posting new post");
    $error = false;
    //$postRecord = null;

//    $dateTimeStamp = cleanInputPost("dateTime1");
    date_default_timezone_set('America/Toronto');
    $dateTimeStamp = date('Y-m-d H:i:s'); // when the study is made active

    $text = cleanInputPost("text1");
    $image = cleanInputPost("image1");
    $conditionGroupNum = cleanInputPost("conditionGroupNum1");
    $phaseNum = cleanInputPost("phaseNum1");
    $studyID = cleanInputPost("studyID1");

    error_log("userID: ".$adminID." dateTime: ".$dateTimeStamp." postText: ".$text. " image: ". $image." conditionGroupNum: ".$conditionGroupNum." phase: ".$phaseNum." study: ".$studyID, 0);

    if (empty($text)) {
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
        $postRecord = createPost($adminID, $dateTimeStamp, $text, $image, $conditionGroupNum, $phaseNum, $studyID);  
        
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
                            
  case 'DELETE':
    error_log("got into admin-monitor-users - DELETE");
        $error = false;
        // get parameters
        parse_str($_SERVER['QUERY_STRING'], $query_params);
        if (!isset($query_params['postID'])) {
            $error = true;
            $errorMsg = 'No post specified';
        }
        else if (!ctype_digit($query_params['postID'])){       // must be all digits
            $error = true;
            $errorMsg = 'Illegal post specified';
        }
        else {
            // check if there was an database error or nothing returned
            $postID = $query_params['postID'];
            
            if (!deletePost($postID)) {
                $error = true;
                $errorMsg = 'No post  found';
            }
            else
                $errorMsg = 'Post deleted';        
        }
        echo json_encode(array(
                  "error" => $error,
                  "errorMsg" => $errorMsg));
        break;
        
    default:
        http_response_code(404);
        echo "Error: Unrecognised request.";
        echo json_encode(array(
                  "error" => true,
                  "errorMsg" => "Error: Unrecognised request."));
        break;
}


function getStudyPosts($studyID) {
    $conn = dbConnect();


// TODO: Do join with matching study, phase and cg num params
    $sql =  "SELECT *".
            "FROM postTable ".
            "WHERE studyID=".$studyID.";";
 
    $result = mysqli_query($conn, $sql);

    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        }
    }
        
    mysqli_close($conn);    
    return $rows;

}   
