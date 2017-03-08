<?php
	
	/*
		Create a daily entry.
	*/
	
	require_once 'connection.php';
	
	$conn = dbConnect();
	
	$obj = json_decode($_POST["newEntryData"], false);
	
	$userID = $obj["userID"];
	$date = $obj["date"];
	$startTime = $obj["startTime"];
	$startEnergy = $obj["startEnergy"];
	$endTime = $obj["endTime"];
	$endEnergy = $obj["endEnergy"];
	$ccGroup = $obj["currentConditionGroup"];
	$currentPhase = $obj["currentPhase"];
	
	$query = "INSERT INTO dailyEntriesTable ( userID, date, startTime, startEnergy, 
			  endTime, endEnergy, currentConditionGroup, currentPhase )
			  VALUES ($userID, $date, $startTime, $startEnergy, $endTime, $endEnergy
			  $ccGroup, $currentPhase)";
		  
    $result = mysqli_query($conn, $query);
    
    mysqli_close($conn);	// Close database connection
?>