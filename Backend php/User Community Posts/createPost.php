<?php
	
	/*
		Create a post to the Community posts page.
	*/
	
	require_once 'connection.php';
	
	$conn = dbConnect();
	
	$obj = json_decode($_POST["newPostData"], false);
	
	$userID = $obj["userID"];
	$dateTime = $obj["dateTime"];
	$text = $obj["text"];
	$image = $obj["image"];
	$conditionGroupNum = $obj["conditionGroupNum"];
	$phaseNum = $obj["phaseNum"];
	
	$query = "INSERT INTO postTable (userID, dateTime, text, image, conditionGroupNum, phaseNum)
			  VALUES ('".$userID."', '".$dateTime."', '".$text."', '".$image."', '".$conditionGroupNum."', '".$phaseNum."')";
	
    $result = mysqli_query($conn, $query);
	
    // check if any records found. If records found, gather them into an array and return the array
    if ($result == false)
        //$rows = null; // echo error message or return something?
    
    mysqli_close($conn);	// Close database connection
?>