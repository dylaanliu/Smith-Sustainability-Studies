<?php
	
	/*
		Create an Admin user account.
	*/
	
	require_once 'connection.php';
	
	$conn = dbConnect();
	
	$obj = json_decode($_POST["x"], false); // change "x"
	
	$userName = $obj[];
	$pw = $obj[];
	$firstName = $obj[];
	$lastName = $obj[];
	$privilegeLevel = $obj[];
	
	$query = "INSERT INTO userTable
			  VALUES ($userName, $pw, $firstName, $lastName, $privilegeLevel)";
		  
    $result = mysqli_query($conn, $query);
    
    mysqli_close($conn);	// Close database connection
?>