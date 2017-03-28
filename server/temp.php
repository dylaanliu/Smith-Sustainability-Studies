<?
function createConditionGroupPhase($studyID, $conditionGroupNum, $phaseNum, $phaseStarted, $phaseEnded, $phasePermission, $entriesNum, $postsNum, $likesNum) {
    $conn = dbConnect();
    
    // build string and insert new record
    $sql = "INSERT INTO conditionGroupPhaseTable ".
           "(studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum)".
           " VALUES ".
           "('".$studyID."','".$conditionGroupNum."','".$phaseNum."','".$phaseStarted."','".$phaseEnded."',b'".$phasePermission."','".$entriesNum."','".$postsNum."','".$likesNum."')".
           ";";
    $result = mysqli_query($conn, $sql);
    
    // return null if the creation was not successful
    if (!$result) {
        mysqli_close($conn);    
        return null;
    }

    // get the record and hence the ID if record was successfully created
    $sql = "SELECT * from conditionGroupPhaseTable ORDER BY ID DESC LIMIT 1;";
    $result = mysqli_query($conn, $sql);

    // check if any record found. If records found, gather them into an array and return the array
    if ($result == false) 
        $row = null;
    else 
        $row = mysqli_fetch_array($result);

    mysqli_close($conn);        
    return $row;    
}
?>