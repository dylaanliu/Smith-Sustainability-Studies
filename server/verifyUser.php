<?php
    // start a session to determine if there is currently a session. In addition, establish connection
    // to the database.
    session_start();
    require_once 'utils/dbConnect.php';
    $error = false;

    // if session is set already, do not allow re-validation. Go to admin or user home. 
     if (isset($_SESSION['userName']) != "" ) {
            echo json_encode(array(
                "error" => true,
                "errorMsg" => "Error: Already logged in. Please log out first",
                "redirect" => ""));
            exit;
    }

     
    // prevent sql injections/clear user invalid inputs
	$username_in = trim($_POST['username1']);        // Fetching Values from URL.
    $username_in = strip_tags($username_in);
    $username_in = htmlspecialchars($username_in);
    if (empty($username_in))
        $error = true;
    
	$password_in = trim($_POST['password1']);        // Fetch the password
    $password_in = strip_tags($password_in);
    $password_in = htmlspecialchars($password_in);
    if (empty($password_in))
        $error = true;
    
    if (!$error) {
        // stuff below should be in a function. Fix later.
        $encodedPW = hash('sha512', $password_in);    // password hashing using SHA512
      
error_log($encodedPW, 0);

        $res = mysqli_query($conn, "SELECT * FROM userTable WHERE userName = '$username_in'");
        $row = mysqli_fetch_array($res);
        $count = mysqli_num_rows($res);                // return must be 1 row
       
        // if password is correct, save session information and send JSON data to 
        // client to 
        if ($count == 1 && $row['encodedPW'] == $encodedPW ) {
            // remember user info for the session
            $_SESSION['userID'] = $row['userID'];
            $_SESSION['userName'] = $row['userName'];
            $_SESSION['privilegeLevel'] = $row['privilegeLevel'];
            
            // setup values for client
            $errorMsg = "Successfully Logged in...";
            if ($row['privilegeLevel'] == "admin" || $row['privilegeLevel'] == "super_admin") {
                $redirect = "/498/admin-home.html";
            } else {
                $redirect = "/498/user-home.html";            
            }
        } else {
            $error = true;
            $errorMsg = "Username or Password is wrong...!!!!";
        }    

        echo json_encode(array(
              "error" => $error,
              "errorMsg" => $errorMsg, 
              "redirect" => $redirect));

    }
?>

