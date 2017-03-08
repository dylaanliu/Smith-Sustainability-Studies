<?php
	
	/*
		Update Admin user information.
	*/
	
	require_once 'connection.php';
	
	$conn = dbConnect();
	
	$obj = json_decode($_POST["x"], false); // change "x"
	
	$userName = $obj[];
	$pw = $obj[];
	$userID = (int) $obj[];
	
	$query = "UPDATE userTable
		  SET userName = $userName, encodedPW = $pw
		  WHERE userID = $userID";
		  
    $result = mysqli_query($conn, $query);
    
    mysqli_close($conn);	// Close database connection
?>