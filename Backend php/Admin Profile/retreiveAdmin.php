<?php
	
	/*
		Retreive Admin user information.
	*/
	
	require_once 'connection.php';
	
	$obj = json_decode($_POST["x"], false); // change "x"
	
	$ID = (int) $obj["ID"];
	
	$conn = dbConnect();
	
	//$query = "SELECT userName, encodedPW FROM userTable WHERE userID = ?";
    $result = mysqli_query($conn, "SELECT userName, encodedPW FROM userTable WHERE userID = '" .$ID. "'");
	
	//$stmt = $conn->prepare($query);		// prepare query
		
	//$stmt->bind_Param("i", $ID);
	//$stmt->execute();
	//$result = $stmt->get_result();
	
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
	
    return json_encode($rows);
?>