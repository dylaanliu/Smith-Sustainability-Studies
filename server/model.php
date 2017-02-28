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



///////////////////////////////////////////////////////////////////////////////////////
// adminStudiesTable Table Functions
///////////////////////////////////////////////////////////////////////////////////////




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



