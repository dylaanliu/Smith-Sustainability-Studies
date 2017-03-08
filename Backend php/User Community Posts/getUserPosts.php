<?php
	
	/*
		Retreive posts made by all users.
	*/
	
	require_once 'connection.php';
	
	$conn = dbConnect();
	
	$query = "SELECT Posts.postId, Posts.userId, Users.username, Posts.dateTime,
              Posts.text, Posts.image, Posts.conditionGroupNum, Posts.phaseNum
			  FROM Posts INNER JOIN Users
			  ON Posts.userId = Users.userId";
	
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