<?php



///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
//
//  MODEL API FUNCTIONS
//
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////
// userTable Table Functions
///////////////////////////////////////////////////////////////////////////////////////

// This function takes a user name and password and returns a user record if valid and a null if not valid.
// Relies on utils/dbConnect.php
function validateUser($usernameIn, $passwordIn) {
    $conn = dbConnect();
    
    $encodedPW = hash('sha512', $passwordIn);    // password hashing using SHA512      
error_log($encodedPW, 0);

    $res = mysqli_query($conn, "SELECT * FROM userTable WHERE userName = '$usernameIn'");
    $row = mysqli_fetch_array($res);
    $count = mysqli_num_rows($res);                // return must be 1 row
    if ($count == 1 && $row['encodedPW'] == $encodedPW )
        return $row;
    return null;            
}


// get user from the userTable table
function getUser($userID) {
    
    $conn = dbConnect();
    $result = mysqli_query($conn, "SELECT * FROM userTable WHERE userID='".$userID."';");

    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $row['encodedPW'] = '';             // don't send password to client for security reasons
            $rows[] = $row;
        }
    }
    
    mysqli_close($conn);    
    return $rows;
}


// get all the records from the userTable table
function getAllUsers() {
    
    $conn = dbConnect();
    $result = mysqli_query($conn, "SELECT * FROM userTable");

    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $row['encodedPW'] = '';             // don't send password to client for security reasons
            $rows[] = $row;
        }
    }
    
    mysqli_close($conn);    
    return $rows;
}


// delete a user from the userTable table
function deleteUser($userID) {
    
    $conn = dbConnect();

    $sql = "DELETE FROM userTable WHERE userID = '".$userID."';";
    $result = mysqli_query($conn, $sql);

    mysqli_close($conn);    
    return $result;
}

// create a user in the userTable table. Returns userID if successful; otherwise returns null.
function createUser($userName, $firstName, $lastName, $password, $email, $privilegeLevel, $adminID) {
    
    $conn = dbConnect();
     
    // TODO - centralize in one location for maintainability 
    $encodedPW = hash('sha512', $password);
    
    // build string and insert new record
    $sql = "INSERT INTO userTable ".
           "(userName, encodedPW, firstName, lastName, email, privilegeLevel, adminID)".
           " VALUES ".
           "('".$userName."','".$encodedPW."','".$firstName."','".$lastName."','".$email."','".$privilegeLevel."','".$adminID."')".
           ";";
    $result = mysqli_query($conn, $sql);
    
    // get the userID if record was successfully created
    if (!$result) {
        mysqli_close($conn);    
        return null;
    }

    // get last inserted record
    $sql = "SELECT * from userTable ORDER BY userID DESC LIMIT 1;";
    $result = mysqli_query($conn, $sql);

    // check if any record found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else 
        $rows = array(mysqli_fetch_assoc($result));

    mysqli_close($conn);        
    return $rows;
}
            

// update a user in the userTable table. Returns true if successful; otherwise returns false.
function updateUser($userID, $userName, $firstName, $lastName, $email, $studyID, $currentConditionGroup, $currentPhase, $teamNum) {
    
    $conn = dbConnect();
     
    // build string and insert new record
    $sql = "UPDATE userTable SET ".
           "userName='".$userName."',".
           "firstName='".$firstName."',".
           "lastName='".$lastName."',".
           "email='".$email."',".
           "studyID='".$studyID."',".
           "currentConditionGroup='".$currentConditionGroup."',".
           "currentPhase='".$currentPhase."',".
           "teamNum='".$teamNum."'".
           "WHERE userID=".$userID.";";
    $result = mysqli_query($conn, $sql);

    mysqli_close($conn);    
    return $result;    
}


// update a subset of the user record in the userTable table. Returns true if successful; otherwise returns false.
// Probably a better way of doing this by combining this function with the updateUser function.
function updateProfile($userID, $toUpdate) {
    
    $conn = dbConnect();
    
	$userName = toUpdate["userName"];
	$encodedPW = $toUpdate["encodedPW"];
	$email = $toUpdate["email"];
	
    // TODO - centralize in one location for maintainability 
    $encodedPW = hash('sha512', $password);
     
    // build string and insert new record
    $sql = "UPDATE userTable SET ".
           "userName='".$userName."',".
           "encodedPW='".$encodedPW."',".
           "email='".$email."'".
           " WHERE userID='".$userID."';";
		   
    $result = mysqli_query($conn, $sql);

    mysqli_close($conn);    
	
    return $result;    
}


///////////////////////////////////////////////////////////////////////////////////////
// adminStudiesTable Table Functions
///////////////////////////////////////////////////////////////////////////////////////


// Inserts admin - study relationships into the adminStudiesTable table. Given $userID,
//     1) checks if the $userID has the appropriate privilage (is an admin or superadmin). If so,
//        adds the association into the table.
//     2) adds an association for all superadmin users into the table since all superadmins should 
//        see all studies   
function createAdminStudies($userID, $study) {
    $numRecords = 0;
    $conn = dbConnect();
    
    // get user record if the user is an admin
    $sql = "SELECT * from userTable WHERE userID='".$userID."' AND (privilegeLevel = 'admin' OR privilegeLevel = 'super_admin');";
    $result = mysqli_query($conn, "SELECT * FROM userTable");

    // if user is not an admin, return null to indicate error
    if (!$result || mysqli_num_rows($result) == 0) {
        mysqli_close($conn);    
        return $numRecords;
    }

    // get user's record and all records of super_admins
    $sql = "SELECT * from userTable WHERE userID='".$userID."' OR privilegeLevel='super_admin';";
    $userRecords = mysqli_query($conn, $sql);
    
    // For each admin/super_admin user record, create a user-study record in the adminStudiesTable table
    if (!$userRecords || mysqli_num_rows($userRecords) == 0) {
        mysqli_close($conn);    
        return $numRecords;
    } 
    else {
        while($userRecord = mysqli_fetch_array($userRecords)) {
            $sql = "INSERT INTO adminStudiesTable ".
                   "(userID, studyID)".
                   " VALUES ".
                   "('".$userRecord['userID']."','".$study."')".
                   ";";
            $result = mysqli_query($conn, $sql);
            
            // TODO - error in insertion - abort. Should really clean up and remove inserted records.
            if (!$result) {
                mysqli_close($conn);    
                return 0;
            } 
            else
                $numRecords++;
        }
    }
    mysqli_close($conn);        
    return $numRecords;
}


// This function access the "adminStudiesTable" first to get the studies associated with
// an admin. Then it access the "studyTable" to get the records of interest. This is done using a JOIN.
function getAdminStudies($adminID) {
    $conn = dbConnect();
     
    // build string and insert new record
    $sql =  "SELECT * ".
            "FROM adminStudiesTable ".
            "INNER JOIN studyTable ".
            "ON adminStudiesTable.studyID=studyTable.studyID ".
            "WHERE userID=".$adminID.";";
 
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
error_log(print_r($rows, true),0);        
    mysqli_close($conn);    
    return $rows;
}

// This function access the "adminStudiesTable" first to get the studies associated with
// an admin. Then it access the "conditionGroupPhaseTable" to get the records of interest. This is done using a JOIN.
function getAdminConditionGroupPhase($adminID) {
    $conn = dbConnect();
     
    // build string and insert new record
    $sql =  "SELECT * ".
            "FROM adminStudiesTable ".
            "INNER JOIN conditionGroupPhaseTable ".
            "ON adminStudiesTable.studyID=conditionGroupPhaseTable.studyID ".
            "WHERE userID=".$adminID.";";
 
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


///////////////////////////////////////////////////////////////////////////////////////
// studyTable Table Functions
///////////////////////////////////////////////////////////////////////////////////////

// create a study in the studyTable table. Returns study record if successful; otherwise returns null.
function createStudy($title, $description, $conditionGroups, $phases, $startDate, $endDate, $status) {    
    $conn = dbConnect();
    
    // build string and insert new record
    $sql = "INSERT INTO studyTable ".
           "(title, description, conditionGroups, phases, startDate, endDate, status)".
           " VALUES ".
           "('".$title."','".$description."','".$conditionGroups."','".$phases."','".$startDate."','".$endDate."','".$status."')".
           ";";
    $result = mysqli_query($conn, $sql);

    // return null if the creation was not successful
    if (!$result) {
        error_log("unsuccessful create",0);
        mysqli_close($conn);    
        return null;
    }

    // get the study record and hence the studyID if record was successfully created
    $sql = "SELECT * from studyTable ORDER BY studyID DESC LIMIT 1;";
    $result = mysqli_query($conn, $sql);

    // check if any record found. If records found, gather them into an array and return the array
    if ($result == false) 
        $row = null;
    else 
        $row = mysqli_fetch_array($result);

    mysqli_close($conn);        
    return $row;
}

// This function access the "studyTable" first to get the study specified 
// Then it access the "adminStudiesTable" to get the records of interest. This is done using a JOIN.
function getStudy($studyID) {
    $conn = dbConnect();

    // build string and insert new record
    $sql =  "SELECT * ".
            "FROM studyTable ".
            //"INNER JOIN studyTable ".
            //"ON adminStudiesTable.studyID=studyTable.studyID ".
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

function progressPhase($studyID) {
	// progress user by a phase after meeting condition (numPosts, likes, shares)
	// need studyID to check number of phases in study
}

///////////////////////////////////////////////////////////////////////////////////////
// dailyEntriesTable Table Functions
///////////////////////////////////////////////////////////////////////////////////////

function getDailyEntries($userID, $complete) {
	
	$conn = dbConnect();	// Create database connection
	
	if ($complete) {	// Get all completed daily entries
		$query = "SELECT * FROM dailyEntriesTable
				  WHERE userID = '".$userID."';";
    }		
	else {				// Get all incomplete daily entries
		$query = "SELECT * FROM dailyEntriesTable
				  WHERE userID = '".$userID."' AND endTime = '00:00:00';";
	}
	
	$result = mysqli_query($conn, $query);
	
	// check if any records found. If records found, gather them into an array and return the array
	if ($result == false)
		$rows = null;
	else {
		$rows = array();
		while($row = mysqli_fetch_assoc($result)) {
			$rows[] = $row;
		} // end while
	} // end else

    mysqli_close($conn);	// Close database connection
	
	return $rows;
	
}

// Retrieve all the daily entries for the specified condition group number.
function getDailyEntryCG($cgNum) {
	
	$conn = dbConnect();	// Create database connection
	
	$query = "SELECT dailyEntriesTable.entryId, dailyEntriesTable.userId, userTable.username, dailyEntriesTable.date,
               dailyEntriesTable.startTime, dailyEntriesTable.startEnergy, dailyEntriesTable.endTime,
               dailyEntriesTable.endEnergy, dailyEntriesTable.conditionGroupNum, dailyEntriesTable.phaseNum, 
			   dailyEntriesTable.teamNumber
			   FROM dailyEntriesTable INNER JOIN userTable
			   ON dailyEntriesTable.userId = userTable.userId AND dailyEntriesTable.conditionGroupNum = '".$cgNum."';";
	
	$result = mysqli_query($conn, $query);
	
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        } // end while
    } // end else
    
    mysqli_close($conn);	// Close database connection
	
	return $rows;
	
}

function updateDailyEntry($userID, $entryID, $toUpdate) {
	
	$conn = dbConnect();	// Create database connection
	
	$entryDate = $toUpdate["entryDate"];
	$startTime = $toUpdate["startTime"];
	$startEnergy = $toUpdate["startEnergy"];
	$endTime = $toUpdate["endTime"];
	$endEnergy = $toUpdate["endEnergy"];
	
	$query = "UPDATE dailyEntriesTable
		  SET entryDate = '".$entryDate."', startTime = '".$startTime."', endTime = '".$endTime."',
		  startEnergy = '".$startEnergy."', endEnergy = '".$endEnergy."'
		  WHERE userID = '".$userID."' AND entryID = '".$entryID"';";
	
    $result = mysqli_query($conn, $query);
    
    mysqli_close($conn);	// Close database connection
	
	return $result;
}

function createDailyEntry($userID, $entryDate, $startTime, $startEnergy, $endTime, $endEnergy, 
  $CurrentConditionGroup, $currentPhase) {
	
	$conn = dbConnect();	// Close database connection
	
	$query = "INSERT INTO dailyEntriesTable ( userID, date, startTime, startEnergy, 
			  endTime, endEnergy, currentConditionGroup, currentPhase )
			  VALUES ('".$userID."', '".$entryDate."', '".$startTime."', '".$startEnergy."', '".$endTime."', '".$endEnergy."', '"
			  .$CurrentConditionGroup."', '".$currentPhase"');";
		  
    $result = mysqli_query($conn, $query);
    
    mysqli_close($conn);	// Close database connection
	
	return $result;
	
}

///////////////////////////////////////////////////////////////////////////////////////
// conditionGroupPhaseTable Table Functions
///////////////////////////////////////////////////////////////////////////////////////


// create a condition group pahse record
function createConditionGroupPhase($studyID, $conditionGroupNum, $phaseNum, $phaseStarted, $phaseEnded, $phasePermission, $entriesNum, $postsNum, $likesNum) {
    $conn = dbConnect();
    
    // build string and insert new record
    $sql = "INSERT INTO conditionGroupPhaseTable ".
           "(studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum)".
           " VALUES ".
           "('".$studyID."','".$conditionGroupNum."','".$phaseNum."','".$phaseStarted."','".$phaseEnded."',b'".$phasePermission."','".$entriesNum."','".$postsNum."','".$likesNum."')".
           ";";
    $result = mysqli_query($conn, $sql);
    
    // return null if the creation was not successful
    if (!$result) {
        mysqli_close($conn);    
        return null;
    }

    // get the record and hence the ID if record was successfully created
    $sql = "SELECT * from conditionGroupPhaseTable ORDER BY ID DESC LIMIT 1;";
    $result = mysqli_query($conn, $sql);

    // check if any record found. If records found, gather them into an array and return the array
    if ($result == false) 
        $row = null;
    else 
        $row = mysqli_fetch_array($result);

    mysqli_close($conn);        
    return $row;    
}

function getConditionGroupPhase($studyID, $cgNum, $phaseNum) {
	
	$conn = dbConnect();	// Create database connection
	
	$query = "SELECT ID, studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded,
			  phasePermission, entriesNum, postsNum, likesNum
			  FROM conditionGroupPhaseTable
			  WHERE studyID = '".$studyID."' AND condtionGroupNum = '".$cgNum."' AND phaseNum = '".$phaseNum."';";
	
    $result = mysqli_query($conn, $query);
	
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        } // end while
    } // end else
    
    mysqli_close($conn);	// Close database connection
	
	return $rows;

///////////////////////////////////////////////////////////////////////////////////////
// postTable Table Functions
///////////////////////////////////////////////////////////////////////////////////////

function createPost($userID, $dateTime, $text, $image, $conditionGroupNum, $phaseNum) {
	
	$conn = dbConnect();	// Close database connection
	
	$query = "INSERT INTO postTable (userID, dateTime, text, image, conditionGroupNum, phaseNum)
			  VALUES ('".$userID."', '".$dateTime."', '".$text."', '".$image."', '".$conditionGroupNum."', '".$phaseNum."')";
	
    $result = mysqli_query($conn, $query);
	
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        //$rows = null; // echo error message or return something?
    
    mysqli_close($conn);	// Close database connection

	return $result;
	
}

// Retreive posts made by all users.
function getAllUserPosts() {
	
	$conn = dbConnect();	// Create database connection
	
	$query = "SELECT postTable.postId, postTable.userId, userTable.username, postTable.dateTime,
              postTable.text, postTable.image, postTable.conditionGroupNum, postTable.phaseNum
			  FROM postTable INNER JOIN userTable
			  ON postTable.userId = userTable.userId";
	
    $result = mysqli_query($conn, $query);
	
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        } // end while
    } // end else
    
    mysqli_close($conn);	// Close database connection
	
    return $rows;
	
}

// Retrieve all posts made by admin specified
function getAdminPosts($userID) {
	
	$conn = dbConnect();	// Create database connection
	
	$query = "SELECT postID, postTable.userID, dateTimeStamp, postText, image
			 FROM postTable INNER JOIN userTable
			 ON postTable.userID = '".$userID."' AND userTable.userID = .'"$userID."' AND 
			 userTable.privilegeLevel = ('admin' OR 'super_admin')";

	$result = mysqli_query($conn, $query);
	
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        } // end while
    } // end else
    
    mysqli_close($conn);	// Close database connection
	
    return $rows;
	
}
/* function getUserPostsCG($userID, $conditionGroupNum) {
	
	$conn = dbConnect();	// Create database connection
	
	// use session if session stores both userid and cgnum
	$query = "SELECT postTable.postId, postTable.userId, userTable.username, postTable.dateTime,
              postTable.text, postTable.image, postTable.conditionGroupNum, postTable.phaseNum
			  FROM postTable INNER JOIN userTable
			  ON postTable.userId = '".$userID."' AND userTable.userId = '".$userID."' AND
			  postTable.conditionGroupNum = '".$cgNum."' AND userTable.currentConditionGroup = '".$cgNum."';";
	
    $result = mysqli_query($conn, $query);
	
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        } // end while
    } // end else
    
    mysqli_close($conn);	// Close database connection
	
    return $rows;
	
} */

// This function access the "studyTable" first to get the study specified 
// Then it access the "adminStudiesTable" to get the records of interest. This is done using a JOIN.
function getPostCGPhase($studyID, $conditionGroupNum, $phaseNum) {
    error_log($studyID, 0);
    error_log($conditionGroupNum, 0);
    error_log($phaseNum,0);
    $conn = dbConnect();
/*    $sql = "SELECT * from userTable WHERE userID='".$userID."' AND (privilegeLevel = 'admin' OR privilegeLevel = 'super_admin');";*/
    // build string and insert new record

    /*postTable.postId, postTable.userID, userTable.userName, postTable.dateTimeStamp,
               postTable.postText, postTable.image, postTable.conditionGroupNum, postTable.phaseNum, postTable.studyID ".*/

// TODO: Do join with matching study, phase and cg num params
    //$sql =  "SELECT *".
            //"FROM postTable ;";
           // "INNER JOIN userTable ".
           // "ON postTable.userID=userTable.userID ".
            //"WHERE studyID='".$studyID."' AND conditionGroupNum='".$conditionGroupNum."' AND phaseNum='".$phaseNum."';";
	
	$query = "SELECT *
			 FROM postTable
			 WHERE studyID='".$studyID."' AND conditionGroupNum='".$conditionGroupNum."' AND phaseNum='".$phaseNum."';";
 
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

// delete a post from the postTable 
function deletePost($postID) {
    
    $conn = dbConnect();

    $sql = "DELETE FROM postTable WHERE postID = '".$postID."';";
    $result = mysqli_query($conn, $sql);

    mysqli_close($conn);    
    return $result;
}

function createPost($userID, $dateTimeStamp, $postText, $image, $conditionGroupNum, $phaseNum, $studyID) {
    $conn = dbConnect();
    error_log("userID: ".$userID." dateTime: ".$dateTimeStamp." postText: ".$postText. " image: ". $image." conditionGroupNum: ".$conditionGroupNum." phase: ".$phaseNum." study: ".$studyID, 0);

    $sql = "INSERT INTO postTable (userID, dateTimeStamp, postText, image, conditionGroupNum, phaseNum, studyID) ".
            " VALUES ('".$userID."',".$dateTimeStamp.",'".$postText."','".$image."','".$conditionGroupNum."','".$phaseNum."','".$studyID."');";
           //";";

    $result = mysqli_query($conn, $sql);
    
    // return null if the creation was not successful
    if (!$result) {
        mysqli_close($conn);  
        error_log("No result",0);  
        return null;
    }
    error_log("result: ",0);
    error_log($result,0);

    // get the record and hence the ID if record was successfully created
    $sql = "SELECT * from postTable ORDER BY ID DESC LIMIT 1;";
    $result = mysqli_query($conn, $sql);

    // check if any record found. If records found, gather them into an array and return the array
    if ($result == false) {
        error_log("No row",0);
        $row = null;
    } else {
        $row = mysqli_fetch_array($result);
    }

    mysqli_close($conn);
    error_log("row: ",0);
    error_log($row,0);        
    return $row;    
}

///////////////////////////////////////////////////////////////////////////////////////
// Misc Functions
///////////////////////////////////////////////////////////////////////////////////////


// returns a DB connection handle. Otherwise returns null.
function dbConnect() {
    // this will avoid mysql_connect() deprecation error.
    error_reporting( ~E_DEPRECATED & ~E_NOTICE );
    // but I strongly suggest you to use PDO or MySQLi.
 
    define('DBHOST', '127.0.0.1');
    define('DBUSER', 'root');
    define('DBPASS', 'devcpp');
    define('DBNAME', 'cisc498');
 
    $conn = mysqli_connect(DBHOST,DBUSER,DBPASS);
    if ( !$conn ) {
        die("Connection failed!!!");
    }

    $dbcon = mysqli_select_db($conn, DBNAME); 
    if ( !$dbcon ) {
        die("Database Connection failed!!!");
    }
    return $conn;
}



