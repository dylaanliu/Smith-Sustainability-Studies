<?php
	
	/*
		Retrieve specified condition group phase.
	*/
	
	require_once 'connection.php';
	
	$conn = dbConnect();
	
	$obj = json_decode($_POST["x"], false); // change "x"
	
	$studyID = (int) $obj["studyID"];
	$cgNum = $obj["cgNum"];
	$phaseNum = $obj["phaseNum"];
	
	$query = "SELECT ID, studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded,
			  phasePermission, entriesNum, postsNum, likesNum
			  FROM conditionGroupPhaseTable
			  WHERE studyID = '".$studyID."' AND condtionGroupNum = '".$cgNum."' AND phaseNum = '".$phaseNum."'";
	
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