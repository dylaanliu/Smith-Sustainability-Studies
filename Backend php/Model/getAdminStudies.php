<?php
	
	/*
		Get all studies associated with the admin.
	*/
	
	require_once 'connection.php';
	
	$conn = dbConnect();
	
	$obj = json_decode($_POST["x"], false); // change "x"
	
	$adminID = $obj["adminID"];
	
	$query = "SELECT * FROM adminStudiesTable INNER JOIN studyTable
			  ON adminStudiesTable.studyID = studyTable.studyID
			  WHERE userID = $adminID";
	
	//$stmt = $conn->prepare($query);		// prepare query
		
	//$stmt->bind_Param("s", $username);
	//$stmt->execute();
	//$result = $stmt->get_result();
	
	$result = mysqli_query($conn, $query);
	
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        $rows = null;
    else {
        $rows = array();
		$row = mysqli_fetch_assoc($result);
		$count = mysqli_num_rows($result);
		
		if ($count == 1 && $row['encodedPW'] == $encodedPW ) {
			$rows[] = $row;
		}
		else {
			mysqli_close($conn);	// Close database connection
			return null;
		}
        
    } // end else
    mysqli_close($conn);	// Close database connection
	
	return json_encode($rows);
?>