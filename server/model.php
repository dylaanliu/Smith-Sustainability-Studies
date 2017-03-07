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

// get all the records from the userTable table
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

///////////////////////////////////////////////////////////////////////////////////////
// adminStudiesTable Table Functions
///////////////////////////////////////////////////////////////////////////////////////

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


///////////////////////////////////////////////////////////////////////////////////////
// Misc Functions
///////////////////////////////////////////////////////////////////////////////////////


// returns a DB connection handle. Otherwise returns null.
function dbConnect() {
    // this will avoid mysql_connect() deprecation error.
    error_reporting( ~E_DEPRECATED & ~E_NOTICE );
 
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



