<?php
	
	/*
		Get all data for all users excluding passwords.
	*/
	
	require_once 'connection.php';
	
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
        } // end while
    } // end else
    
    mysqli_close($conn);	// Close database connection
	
    return json_encode($rows);
?>