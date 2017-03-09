<?php
	
	/*
		Retrieve User information.
	*/
	
	require_once 'connection.php';
	
	$conn = dbConnect();
	
	$obj = json_decode($_POST["x"], false); // change "x"
	
	$ID = (int) $obj["ID"];
	
	$query = "SELECT * FROM userTable
			  WHERE userID = '" . $ID . "'";
	
    $result = mysqli_query($conn, $query);
	
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
	
	echo json_encode($rows);
?>