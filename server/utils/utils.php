<?php

// gets a user input parameter from $_GET and cleans it up (sql injections, leading/lagging spaces, etc)
function cleanInputGet($paramName) { 
    $paramIn = isset($_GET[$paramName]) ? trim($_GET[$paramName]) : ''; // Fetching Values from URL.
    $paramIn = strip_tags($paramIn);
    $paramIn = htmlspecialchars($paramIn);
    
    return $paramIn;
}


// gets a user input parameter from $_POST and cleans it up (sql injections, leading/lagging spaces, etc)
function cleanInputPost($paramName) { 
    $paramIn = isset($_POST[$paramName]) ? trim($_POST[$paramName]) : ''; // Fetching Values from URL.
    $paramIn = strip_tags($paramIn);
    $paramIn = htmlspecialchars($paramIn);
    
    return $paramIn;
}


// gets a user input parameter from $_PUT and cleans it up (sql injections, leading/lagging spaces, etc)
function cleanInputPut($paramIn) { 
    $paramIn = strip_tags($paramIn);
    $paramIn = htmlspecialchars($paramIn);
    
    return $paramIn;
}


function isChecked($type, $chkname, $value) {

    if ($type == "POST") {
        if(!empty($_POST[$chkname])) {
            foreach($_POST[$chkname] as $chkval) {
                if($chkval == $value) {
                    return true;
                }
            }
        }
    }
    else if ($type == "PUT") {
        $nameVal = json_decode(file_get_contents("php://input"), true);
        foreach($nameVal as $pair){
            $put_vars[$pair['name']] = $pair['value'];
        }
        foreach($put_vars as $key => $val) {
            $keyArray = explode("_",$key);
            if($keyArray[0]."_".$keyArray[1]."_".$keyArray[2] != $chkname)
                continue;
            
            // error_log("checkName=".$chkname.", key=>".$key);
            // error_log("check value=".$value.", value=".$val);
            if($value == $val) {
                return true;
            }
        }
    }

    return false;
}


// go through $_POST and look for the checkboxes that are checked to create a phasePermission mask
// for a conditionGroupPhaseTable record.
//          Bit Fields
//           1  Data Entry
//           2  Personal Statistics
//           3  Conditional Group Statistics
//           4  Sub-team Statistics
//           5  Share to Social Media
//           6  Submit Tips
//           7  View Admin Tips
//           8  View Condition Group Tips
//           9  View Sub-team Tips
//           10 Share Posts to Social Media
//           11 Private
//           12 Public
//           13 Progression System
//
function makePhasePermission($type, $cg, $ph) {
    $phasePermissionStr = "";
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "progressionSystem") ? "1" : "0";
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "public") ? "1" : "0";
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "private") ? "1" : "0";
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "sharePostsToSocialMedia") ? "1" : "0";
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "viewSubTeamTips") ? "1" : "0";
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "viewConditionGroupTips") ? "1" : "0";
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "viewAdminTips") ? "1" : "0";
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "submitTips") ? "1" : "0";
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "shareToSocialMedia") ? "1" : "0";
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "subTeamStatistics") ? "1" : "0";
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "conditionGroupStatistics") ? "1" : "0";
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "personalStatistics") ? "1" : "0";    
    $phasePermissionStr .= isChecked($type, "phasePermissions_".$cg."_".$ph, "dataEntry") ? "1" : "0";
    return $phasePermissionStr;
}


