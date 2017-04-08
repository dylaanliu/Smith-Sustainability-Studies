<?php
    require_once 'utils/authenticateUser.php';
    verifyUserPrivilage('user');
//error_log(isset($_POST['email1']));
if(isset($_POST['email1'])) {
    function died($error) {
 
        echo "We are sorry that we can procceed your request due to error(s)";    
        echo "Below is the error(s) list <br /><br />";    
        echo $error."<br /><br />";    
        echo "Please go back and fix these errors.<br /><br />";    
        die();    
    }

//error_log("user contact ctr", 0);
    $error = false;
    $errorMsg = "";
    $error_message ="";
    $email_message ="";
    $name = cleanInputPost('name1');
    $email = cleanInputPost('email1');
    $subject = cleanInputPost('subject1');
    $message = cleanInputPost('message1');
    $from = 'From: Smith Sustainability Studies'; 
    $email_to = 'queens.smith.env@gmail.com'; 
    //$subject = 'Study Participant Question';
    $antiSpam = cleanInputPost('antiSpam1');

                ;		
    $body = "From: $name\n E-Mail: $email\n Message:\n $message";
    			
  // error_log("name: ".$name." email: ".$email." message ".$message." antiSpam ".$antiSpam, 0);

    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/'; 
    if(!preg_match($email_exp,$email)) {     
        $errorMsg = 'Invalid email';
        $error_message .= 'You entered an invalid email<br />';    
    }

    $string_exp = "/^[A-Za-z .'-]+$/";
 
    if(!preg_match($string_exp,$name)) {
        $errorMsg = 'Invalid name';
        $error_message .= 'Invalid first name<br />';
    }

    if(strlen($message) < 2) {
        $errorMsg = 'Invalid message';
        $error_message .= 'Invalid message<br />';
    }

    if(strlen($error_message) > 0) {
        died($error_message);
    }

    $email_message .= "Name: ".$name."\n";    
    $email_message .= "Email: ".$email."\n";    
    $email_message .= "Message: ".$message."\n";

    // create email headers     
    $headers = 'From: '.$email."\r\n".     
    'Reply-To: '.$email."\r\n" .    
    'X-Mailer: PHP/' . phpversion();
     
    @mail($email_to, $subject, $message, $headers);

 /*   if ($name != '' && $email != '' && $subject != '' && $message != '') {
        if ($antiSpam == '4') {                 
            if (mail ($to, $subject, $body, $from)) {
                error_log("message sent", 0); 
                $errorMsg = "Message sent!";
                echo '<p>Your message has been sent!</p>';
            } else { 
                $error = true;
                $errorMsg = "Something went wrong";
                echo '<p>Something went wrong, go back and try again!</p>'; 
            } 
        } else {
            $error = true;
            $errorMsg = "Anti-spam question not answered correctly";
            echo '<p>You answered the anti-spam question incorrectly!</p>';
        }
    } else {
        $errorMsg = "Not all fields filled out!";
        echo '<p>You need to fill in all required fields!!</p>';
    }*/

    
    echo json_encode(array(
          "error" => $error,
          "errorMsg" => $errorMsg
    ));

}
?>