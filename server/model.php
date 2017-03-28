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

    $res = mysqli_query($conn, "SELECT * FROM userTable WHERE userName = '$usernameIn'");
    $row = mysqli_fetch_array($res);
    $count = mysqli_num_rows($res);                // return must be 1 row
    if ($count == 1 && $row['encodedPW'] == $encodedPW )
        return $row;
    return null;            
}


// get user from the userTable table
function getUser($userID, $hideEncodedPW = true) {
    
    $conn = dbConnect();
    if ($hideEncodedPW)
        $columns = "userID, userName, firstName, lastName, email, privilegeLevel, adminID, studyID, currentConditionGroup, ".
                   "currentPhase, teamNum, entriesNumPhase, postsNumPhase, likesNumPhase, entriesNumTotal, postsNumTotal, likesNumTotal ";
    else
        $columns = "userID, userName, encodedPW, firstName, lastName, email, privilegeLevel, adminID, studyID, currentConditionGroup, ".
                   "currentPhase, teamNum, entriesNumPhase, postsNumPhase, likesNumPhase, entriesNumTotal, postsNumTotal, likesNumTotal ";
        
    $result = mysqli_query($conn, "SELECT ".$columns." FROM userTable WHERE userID='".$userID."';");

    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
//            if ($hideEncodedPW)
//                $row['encodedPW'] = '';             // don't send password to client for security reasons
            $rows[] = $row;
        }
    }
    
    mysqli_close($conn);    
    return $rows;
}



// get all the records from the userTable table
function getAllUsers() {
    
    $conn = dbConnect();
    $columns = "userID, userName, firstName, lastName, email, privilegeLevel, adminID, studyID, currentConditionGroup, ".
               "currentPhase, teamNum, entriesNumPhase, postsNumPhase, likesNumPhase, entriesNumTotal, postsNumTotal, likesNumTotal ";
    $result = mysqli_query($conn, "SELECT ".$columns." FROM userTable");

    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
//            $row['encodedPW'] = '';             // don't send password to client for security reasons
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
function updateProfile($userID, $userName, $password, $email) {
    
    $conn = dbConnect();
    
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


// this function increments,decrements,compares  columns in the userTable table.
//
// Returns true of delete successful; otherwise returns false.
function operateUserTable($userID, $operation) {
    $result = false;
    $conn = dbConnect();
 error_log($operation,0);   
    // build string and update condition group count 
    $sql =  "UPDATE userTable ";
    if ($operation == "incr_teamNum")
        $sql .= "SET teamNum = teamNum + 1 ";
    else if ($operation == "decr_teamNum")
        $sql .= "SET teamNum = teamNum - 1 ";
    $sql .= " WHERE userID=".$userID.";";

    if ($operation == "incr_teamNum" || $operation == "decr_teamNum")
        $result = mysqli_query($conn, $sql);

    mysqli_close($conn);   
    if ($result == false)    
        return false;
    return true;
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
           "(title, description, conditionGroups, phases, maxConditionGroupNum, startDate, endDate, status)".
           " VALUES ".
           "('".$title."','".$description."','".$conditionGroups."','".$phases."','".$conditionGroups."','".$startDate."','".$endDate."','".$status."')".
           ";";
    $result = mysqli_query($conn, $sql);
    
    // return null if the creation was not successful
    if (!$result) {
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


// get user from the userTable table
function getStudy($studyID) {
    
    $conn = dbConnect();
    $result = mysqli_query($conn, "SELECT * FROM studyTable WHERE studyID='".$studyID."' LIMIT 1;");

    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false) 
        $row = null;
    else 
        $row = mysqli_fetch_array($result);

    mysqli_close($conn);        
    return $row;
}


// update a user in the userTable table. Returns true if successful; otherwise returns false.
function updateStudy($studyID, $fieldArray) {
    
    $conn = dbConnect();
    $numFields = count($fieldArray);
     
    if ($numFields == 0)
        return true;
    
    // build string and insert new record
    $i = 0;
    $sql = "UPDATE studyTable SET ";
    foreach($fieldArray as $field => $field_value) {
        if (++$i == $numFields)
            $sql .= $field."='".$field_value."' ";
        else
            $sql .= $field."='".$field_value."', ";
    }    
    $sql .= "WHERE studyID=".$studyID.";";
    $result = mysqli_query($conn, $sql);

    mysqli_close($conn);    
    
    if ($result != 0)
        return true;    
    return false;    
}

            
// this function deletes a study from the tables. All records of users, condition groups, users posts,
// user entries are deleted. 
//
        //     - delete the study (studyID) in the studyTable
        //     - delete all users in the study (studyID) found in the userTable
        //     - delete all records of the study (studyID) found in the adminStudiesTable
        //     - delete all records of the study (studyID) found in the conditionGroupPhaseTable
        //     - delete all records of users (userID) in the study found in the dailyEntriesTable
        //     - delete all records of the study (studyID) in the postTable

// Returns true if the delete was successful
function deleteStudy($studyID) {
    $conn = dbConnect();
    $result = true;

    // since the dailyEntriesTable does not have a studyID in each record, must do the 
    // deletes in this table fist since it requires other tables    
    $sql = "DELETE dailyEntriesTable ". 
           "FROM dailyEntriesTable ".
           "INNER JOIN userTable ".
               "ON dailyEntriesTable.userID = userTable.userID ".
            "WHERE userTable.studyID=".$studyID.";";
    $result = $result && mysqli_query($conn, $sql);
    
    // other deletes which are only dependent on studyID. Can be done in 1 querry but
    // clearer using separate queries
    $sql = "DELETE FROM postTable WHERE studyID=".$studyID.";";
    $result = $result && mysqli_query($conn, $sql);
    $sql = "DELETE FROM conditionGroupPhaseTable WHERE studyID=".$studyID.";";
    $result = $result && mysqli_query($conn, $sql);
    $sql = "DELETE FROM adminStudiesTable WHERE studyID=".$studyID.";";
    $result = $result && mysqli_query($conn, $sql);
    $sql = "DELETE FROM userTable WHERE studyID=".$studyID.";";
    $result = $result && mysqli_query($conn, $sql);
    $sql = "DELETE FROM studyTable WHERE studyID=".$studyID.";";
    $result = $result && mysqli_query($conn, $sql);

    mysqli_close($conn);    
    return $result;
}


// this function increments,decrements,compares the condition groups columns in the studyTable table.
//
// Returns true of delete successful; otherwise returns false.
function operateStudyTable($studyID, $operation) {
    $conn = dbConnect();

    if ($operation == "equal1_conditionGroups") {
        // build string and insert new record
        $sql =  "SELECT * ".
                "FROM studyTable ".
                "WHERE studyID='".$studyID."' AND conditionGroups = '1';";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1)
            return true;
        return false;
    }
    
    // build string and update condition group count 
    $sql =  "UPDATE studyTable ";
    if ($operation == "incr_conditionGroups")
        $sql .= "SET conditionGroups = conditionGroups + 1 ";
    else if ($operation == "decr_conditionGroups")
        $sql .= "SET conditionGroups = conditionGroups - 1 ";
    else if ($operation == "incr_maxConditionGroupNum")
        $sql .= "SET maxConditionGroupNum = maxConditionGroupNum + 1 ";
    else if ($operation == "decr_maxConditionGroupNum")
        $sql .= "SET maxConditionGroupNum = maxConditionGroupNum - 1 ";
    $sql .= "WHERE studyID=".$studyID.";";
    $result = mysqli_query($conn, $sql);

    mysqli_close($conn);   
    if ($result == false)    
        return false;
    return true;
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


// this function gets records from the the conditionGroupPhaseTable table based on the
// provided studyID bad condition group number.
//
// Returns null if no records found; otherwise returns array of associated arrays of records.
function getConditionGroupPhases($studyID, $conditionGroupNum) {
    $conn = dbConnect();
     
    // build string and get records
    $sql =  "SELECT * ".
            "FROM conditionGroupPhaseTable ".
            "WHERE studyID='".$studyID."' AND conditionGroupNum='".$conditionGroupNum."';";
    $result = mysqli_query($conn, $sql);
error_log($sql);
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false) {
        $rows = null;
    }
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        }
    }
        
    mysqli_close($conn);    
    return $rows;    
}

function getUserConditionGroupPhase($studyID, $conditionGroupNum, $phaseNum) {  
    $conn = dbConnect();    // Create database connection
error_log("study ".$studyID." ".$conditionGroupNum." ".$phaseNum);
    // build string and get records    
/*    $sql = "SELECT * ".
              "FROM conditionGroupPhaseTable ".
              "WHERE studyID='".$studyID."' AND condtionGroupNum='".$cgNum."' AND phaseNum = '".$phaseNum."';";*/
    $sql =  "SELECT * ".
        "FROM conditionGroupPhaseTable ".
        "WHERE studyID='".$studyID."' AND conditionGroupNum='".$conditionGroupNum."' AND phaseNum = '".$phaseNum."';";

    $result = mysqli_query($conn, $sql);
    error_log("message1", 0);
    error_log(print_r($result, true), 0);
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        } // end while
    } // end else
    
    mysqli_close($conn);    // Close database connection   
    return $rows;
}

// update a record in the conditionGroupPhaseTable table. Returns true if successful; otherwise returns false.
function updateConditionGroupPhase($studyID, $conditionGroupNum, $phaseNum, $fieldArray) {
    
    $conn = dbConnect();
    $numFields = count($fieldArray);
     
    if ($numFields == 0)
        return true;
    
    // build string and insert new record
    $i = 0;
    $sql = "UPDATE conditionGroupPhaseTable SET ";
    foreach($fieldArray as $field => $field_value) {
        if ($field == "phasePermission")
            $tmpVal = "b'".$field_value."'";
        else
            $tmpVal = "'".$field_value."'";
        
        
        if (++$i == $numFields)
            $sql .= $field."=".$tmpVal." ";
        else
            $sql .= $field."=".$tmpVal.", ";
    }    

    $sql .= "WHERE studyID=".$studyID." AND conditionGroupNum=".$conditionGroupNum." AND phaseNum=".$phaseNum.";";
    $result = mysqli_query($conn, $sql);

    mysqli_close($conn);    
    
    if ($result == 0)
        return false;  
    return true;    
}


// this function deletes a condition group from the conditionGroupPhaseTable table. 
//
// Returns true if the delete was successful
function deleteConditionGroupPhase($studyID, $conditionGroupNum) {
    $conn = dbConnect();

    $sql = "DELETE FROM conditionGroupPhaseTable WHERE studyID=".$studyID." AND conditionGroupNum=".$conditionGroupNum.";";
    $result = mysqli_query($conn, $sql);

    mysqli_close($conn);    
    if ($result == false)    
        return false;
    return true;
}

///////////////////////////////////////////////////////////////////////////////////////
// postTable Table Functions
///////////////////////////////////////////////////////////////////////////////////////

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
    $sql =  "SELECT *".
            "FROM postTable ;";
           // "INNER JOIN userTable ".
           // "ON postTable.userID=userTable.userID ".
            //"WHERE studyID='".$studyID."' AND conditionGroupNum='".$conditionGroupNum."' AND phaseNum='".$phaseNum."';";
 
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

function getUserPostsCG($studyID, $conditionGroupNum, $phaseNum) { 
    $conn = dbConnect();    // Create database connection
    error_log("condtionGroupNum ".$conditionGroupNum, 0);
    // use session if session stores both userid and cgnum
    $sql = "SELECT postTable.postID, postTable.userID, userTable.userName, postTable.dateTimeStamp,
              postTable.postText, postTable.image, postTable.conditionGroupNum, postTable.phaseNum ".
              "FROM postTable ".
              " INNER JOIN userTable ".
              " ON postTable.userID = userTable.userID ".
              " WHERE postTable.studyID='".$studyID."' AND postTable.conditionGroupNum='".$conditionGroupNum."' AND postTable.phaseNum='".$phaseNum."';";
error_log($sql);
/*    $sql = "SELECT *
              FROM postTable INNER JOIN userTable
              ON postTable.userID = userTable.userID AND userTable.conditionGroupNum = postTable.conditionGroupNum";*/

    
    $result = mysqli_query($conn, $sql);
error_log("result: ");
error_log(print_r($result, true), 0);
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false) {
    error_log("no result for posts", 0);
        $rows = null;
    }
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        } // end while
    } // end else
    
    mysqli_close($conn);    // Close database connection
    
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

     $sql = "INSERT INTO postTable ".
           "(userID, dateTimeStamp, postText, image, conditionGroupNum, phaseNum, studyID)".
           " VALUES ".
           "('".$userID."','".$dateTimeStamp."','".$postText."','".$image."','".$conditionGroupNum."','".$phaseNum."','".$studyID."')".
           ";";

    $result = mysqli_query($conn, $sql);
error_log($sql);
    // return null if the creation was not successful
    if (!$result) {
        mysqli_close($conn);  
        error_log("No result",0);  
        return null;
    }
    error_log("result: ",0);
    error_log($result,0);

    // get the record and hence the ID if record was successfully created
    $sql = "SELECT * from postTable ORDER BY postID DESC LIMIT 1;";
    $result = mysqli_query($conn, $sql);

    // check if any record found. If records found, gather them into an array and return the array
    if ($result == false) {
        error_log("No row",0);
        $row = null;
    } else {
        $row = mysqli_fetch_array($result);
    }

    mysqli_close($conn);
/*    error_log("row: ",0);
    error_log(print_r($row, true),0);    */    
    return $row;    
}

///////////////////////////////////////////////////////////////////////////////////////
// DailyEntriesTable Functions
///////////////////////////////////////////////////////////////////////////////////////
function createDailyEntry($userID, $entryDate, $startTime, $startEnergy, $endTime, $endEnergy, $conditionGroupNum, $phaseNum, $studyID, $teamNumber) {
    
    $conn = dbConnect();    // Close database connection
    
    $sql = "INSERT INTO dailyEntriesTable ".
            "(userID, entryDate, startTime, startEnergy, endTime, endEnergy, conditionGroupNum, phaseNum, studyID, teamNumber)".
              " VALUES ".
            "('".$userID."', '".$entryDate."', '".$startTime."', '".$startEnergy."', '".$endTime."', '".$endEnergy."', '".$conditionGroupNum."', '".$phaseNum."', '".$studyID."', '".$teamNumber."')".
              ";";
     
    $result = mysqli_query($conn, $sql);
    error_log($sql);

    // return null if the creation was not successful
    if (!$result) {
        mysqli_close($conn);  
        error_log("No result",0);  
        return null;
    }

    // get the record and hence the ID if record was successfully created
    $sql = "SELECT * from postTable ORDER BY postID DESC LIMIT 1;";
    $result = mysqli_query($conn, $sql);

    // check if any record found. If records found, gather them into an array and return the array
    if ($result == false) {
        error_log("No row",0);
        $row = null;
    } else {
        $row = mysqli_fetch_array($result);
    }

    mysqli_close($conn);    // Close database connection   
    return $result;   
}

function getStudyDailyEntries($studyID) {

    $conn = dbConnect();
error_log("getStudyDailyEntries: ".$studyID, 0);
    // build string and insert new record
    $sql =  "SELECT * ".
            "FROM dailyEntriesTable ".
            "WHERE studyID=".$studyID.";";
 
    $result = mysqli_query($conn, $sql);
//error_log(print_r($result, true), 0);
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

function getDailyEntries($userID, $complete) {
    
    $conn = dbConnect();    // Create database connection
    error_log("user ID: ".$userID." complete: ".$complete);
    if ($complete) {    // Get all completed daily entries
        $sql = "SELECT * ".
                 " FROM dailyEntriesTable ".
                 " WHERE userID = '".$userID."' AND endEnergy > '0'".
                 " ORDER BY entryDate DESC".
                 ";";
    }       
    else {  // Get all incomplete daily entries, most recent date first
         $sql = "SELECT * ".
                " FROM dailyEntriesTable ".
                "  WHERE userID = '".$userID."' AND endEnergy = '0'". // AND endTime = '00:00:00'."
                " ORDER BY entryDate DESC".
                ";";
    }
    
    $result = mysqli_query($conn, $sql);
    error_log($sql);
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        } // end while
    } // end else

    mysqli_close($conn);    // Close database connection
    
    return $rows;
    
}

// Retrieve all the daily entries for the specified condition group number.
function getDailyEntryCG($conditionGroupNum, $studyID) {
    
    $conn = dbConnect();    // Create database connection
    error_log("conditionGroupNum ".$conditionGroupNum,0);
    error_log("studyID ".$studyID,0);
    $sql = "SELECT dailyEntriesTable.entryID, dailyEntriesTable.userID, userTable.userName, dailyEntriesTable.entryDate,
               dailyEntriesTable.startTime, dailyEntriesTable.startEnergy, dailyEntriesTable.endTime,
               dailyEntriesTable.endEnergy, dailyEntriesTable.conditionGroupNum, dailyEntriesTable.phaseNum, dailyEntriesTable.studyID, dailyEntriesTable.teamNumber ".             
             " FROM dailyEntriesTable ".
             " INNER JOIN userTable ".
             "  ON dailyEntriesTable.userID = userTable.userID AND dailyEntriesTable.studyID = '".$studyID."' AND dailyEntriesTable.conditionGroupNum = '".$conditionGroupNum."';";

    $result = mysqli_query($conn, $sql);
    error_log($sql);
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
        while($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        } // end while
    } // end else
    
    mysqli_close($conn);    // Close database connection
    
    return $rows;
    
}

// get all the records from the dailyEntries table. Return results sorted by date
function getAllAdminDailyEntries() {
    
    $conn = dbConnect();
    $result = mysqli_query($conn, "SELECT * FROM dailyEntriesTable ORDER BY entryDate ASC");

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

function updateDailyEntry($userID, $entryID, $toUpdate) {
    
    $conn = dbConnect();    // Create database connection
    
    $entryDate = $toUpdate["entryDate"];
    $startTime = $toUpdate["startTime"];
    $startEnergy = $toUpdate["startEnergy"];
    $endTime = $toUpdate["endTime"];
    $endEnergy = $toUpdate["endEnergy"];
    
    $sql = "UPDATE dailyEntriesTable SET ".
          "entryDate = '".$entryDate."',".
          "startTime = '".$startTime."', ".
          "endTime = '".$endTime."', ".
          "startEnergy = '".$startEnergy."', ".
          "endEnergy = '".$endEnergy."'".
          " WHERE userID = '".$userID."' AND entryID = '".$entryID."';";
    
    $result = mysqli_query($conn, $sql);
    error_log($sql);
    mysqli_close($conn);    // Close database connection
    
    return $result;
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



