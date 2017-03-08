<?php
	
	/*
		Update the specified daily entry.
	*/
	
	require_once 'connection.php';
	
	$conn = dbConnect();
	
	$obj = json_decode($_POST["x"], false); // change "x"
	
	$userID = (int) $obj["userID"];
	$entryID = (int) $obj["entryID"];
	$endEnergy = $obj["endEnergy"];
	$endTime = $obj["endTime"];
	
	$query = "UPDATE dailyEntriesTable
		  SET endEnergy = $endEnergy, endTime = $endTime
		  WHERE userID = $userID AND entryID = $entryID";
	
    $result = mysqli_query($conn, $query);
    
    mysqli_close($conn);	// Close database connection
?>