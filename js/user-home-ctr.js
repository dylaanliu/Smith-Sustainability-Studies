// jQuery functions for user home page

$(document).ready(function() {

	loadUserHomeView();
	
}); // end function

function loadUserHomeView() {

    var view = "views/user-home-view.html";
    var controller = "server/user-home-ctr.php";
    // need controller data, but the data here is not used in this case

    // can use userData to see which cg and phase user is in
    var userQuery= { q: "getUser"};
    var cgPhaseQuery = { q: "condition_group_phase", studyId: "", CurrentConditionGroup: "", currentPhase: ""};
    var rewardsQuery = { q: "reward", studyId: ""};
    
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            // Get and fill in user information from User Data table
            console.log("page success");
            $.getJSON(controller, userQuery, function(userString) {
                console.log(userString);
                var userArray = userString.data[0];
                console.log(userArray);
                // clear contents
                document.getElementById("username").innerHTML = "";

                // html injection
                document.getElementById("username").textContent=userArray.firstName;
              

                cgPhaseQuery["studyID"] = userArray.studyID;
                cgPhaseQuery["currentConditionGroup"] = userArray.currentConditionGroup;
                cgPhaseQuery["currentPhase"] = userArray.currentPhase;

                $.getJSON(controller, cgPhaseQuery, function(conditionGroupPhaseString){
            console.log(conditionGroupPhaseString);
                    // modify to data[0] when use real function
                    var conditionGroupPhaseArray = conditionGroupPhaseString.ConditionGroupPhase[0];
                    var phasePermission = conditionGroupPhaseArray.phasePermission;
                    var permissionArray = phasePermission.split("");
                    var index = 0;

                    // navigation control
                    // permissionArray[12] = input data
                    // permissionArray[8] to permssionArray[11] = statistics
                    // permissionArray[7] to permissionArray[3] = community posts
                    // permissionArray[0] to permissionArray[2] = rewards section
                    console.log(permissionArray);
                    if(permissionArray[12] == '0'){
                        $("#inputData").hide();
                    } 
                    if(permissionArray[11] == '0' && permissionArray[10] == '0' &&
                              permissionArray[9] == '0' && permissionArray[8] == '0') {
                        $("#statistics").hide();
                    } 
                    if(permissionArray[7] == '0' && permissionArray[6] == '0' &&
                              permissionArray[5] == '0' && permissionArray[4] == '0' &&
                              permissionArray[3] == '0') {
                        $('#communityPosts').hide();
                    }
                    if(permissionArray[2] == '0' && permissionArray[1] == '0' &&
                              permissionArray[0] == '0') {
                        $('#home-mid').hide();
                    }
                    // what's new control
                    $.each(permissionArray, function(key, value){
                        //alert(value);
                        // example: 0100011100011 ->13th bit is basic entry 
                        switch(index){
                            case 0: 
                                if(value == "0"){
                                    $("#progression").hide();
                                }
                                index++;
                                break;
                            case 1: 
                                if(value == "0"){
                                    $("#publicRewards").hide();
                                }
                                index++;
                                break;
                            case 2: 
                                if(value == "0"){
                                    $("#privateRewards").hide();
                                }
                                index++;
                                break;
                            case 3: 
                                if(value == "0"){
                                    $("#socialMediaTips").hide();
                                }
                                index++;
                                break;
                            case 4: 
                                if(value == "0"){
                                    $("#subTeamTips").hide();
                                }
                                index++;
                                break;
                            case 5: 
                                if(value == "0"){
                                    $("#conditionGroupTips").hide();
                                }
                                index++;
                                break;
                            case 6: 
                                if(value == "0"){
                                    $("#adminTips").hide();
                                }
                                index++;
                                break;
                            case 7: 
                                if(value == "0"){
                                    $("#submitTips").hide();
                                }
                                index++;
                                break;     
                            case 8: 
                                if(value == "0"){
                                    $("#socialMediaStats").hide();
                                }
                                index++;
                                break;
                            case 9: 
                                if(value == "0"){
                                    $("#subTeamStats").hide();
                                }
                                index++;
                                break;
                            case 10: 
                                if(value == "0"){
                                    $("#conditionGroupStats").hide();
                                }
                                index++;
                                break;
                            case 11: 
                                if(value == "0"){
                                    $("#personalStats").hide();
                                }
                                index++;
                                break;
                            case 12: 
                                if(value == "0"){
                                    $("#dataEntry").hide();
                                }
                                index++;
                                break;
                            default:
                                break;
                        }


                    })
                    //document.getElementById("home-top").innerHTML = "";
                    //alert(permissionArray[0]);
                });
                
            /*   TODO: Fill in for rewards query            
             $.getJSON(controller, rewardsQuery, function(rewardsArray) {

                });*/


            });
    
            
        }
	});
} // end function