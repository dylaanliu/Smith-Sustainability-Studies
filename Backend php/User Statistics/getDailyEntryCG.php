<?php
	
	/*
		Retrieve all the daily entries for the specified condition group number.
	*/
	
	require_once 'connection.php';
	
	$conn = dbConnect();
	
	$obj = json_decode($_POST["x"], false); // change "x"
	
	$cgNum = (int) $obj["conditionGroupNum"];
	
	$query = "SELECT DailyEntries.entryId, DailyEntries.userId, Users.username, DailyEntries.date,
               DailyEntries.startTime, DailyEntries.startEnergy, DailyEntries.endTime,
               DailyEntries.endEnergy, DailyEntries.conditionGroupNum, DailyEntries.phaseNum, 
			   DailyEntries.teamNumber
			   FROM DailyEntries INNER JOIN Users
			   ON DailyEntries.userId = Users.userId AND DailyEntries.conditionGroupNum = '".$cgNum."'";
	
    //$stmt = $conn->prepare($query);		// prepare query
		
	//$stmt->bind_Param("i", $cgNum);
	//$stmt->execute();
	//$result = $stmt->get_result();
	
	$result = mysqli_query($conn, $query);
	
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