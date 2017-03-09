<?php
	
	/*
		Update a user profile.
	*/
	
	require_once 'connection.php';
	
	$conn = dbConnect();
	
	$obj = json_decode($_POST["x"], false); // change "x"
	
	$userID = $obj["userID"];
	$username = $obj["userName"];
	$pw = $obj["password"];
	$email = $obj["email"];
	
	$query = "UPDATE userTable
			  SET userName = '".$userName."', encodedPW = '".$pw."', email = '".$email."' 
			  WHERE userID = '".$userID."'";
	
	//$stmt = $conn->prepare($query);		// prepare query
		
	//$stmt->bind_Param("s", $username);
	//$stmt->execute();
	//$result = $stmt->get_result();
	
	$result = mysqli_query($conn, $query);
        
    } // end else
    mysqli_close($conn);	// Close database connection
?>