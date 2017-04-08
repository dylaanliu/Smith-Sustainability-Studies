// jQuery functions for user home page

// DO NOT PUT ANYTHING IN READY EXCEPT WHEN DEBUGGING
$(document).ready(function() {
}); // end function

function loadUserHomeView() {
    var view = "views/user-home-view.html";
    var controller = "server/user-home-ctr.php";
    // need controller data, but the data here is not used in this case

    // can use userData to see which cg and phase user is in
    var userQuery= { q: "getUser"};
    var cgPhaseQuery = { q: "condition_group_phase", studyId: "", CurrentConditionGroup: "", currentPhase: ""};
    var rewardsQuery = { q: "reward", studyId: ""};
    
    //make link on nav active
    $('.nav li').removeClass('active');
    $('#userHome').addClass('active');
    
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            // Get and fill in user information from User Data table
            //console.log("page success");
            $.getJSON(controller, userQuery, function(userString) {
                var userArray = userString.data[0];
               
                // clear contents
                document.getElementById("username").innerHTML = "";

                // html injection
                document.getElementById("username").textContent=userArray.firstName;
              

                cgPhaseQuery["studyID"] = userArray.studyID;
                cgPhaseQuery["currentConditionGroup"] = userArray.currentConditionGroup;
                cgPhaseQuery["currentPhase"] = userArray.currentPhase;
                $.getJSON(controller, cgPhaseQuery, function(conditionGroupPhaseString){

                    
                    // check if conditionGroupPhaseString is null; give 0 permission to user
                    if (conditionGroupPhaseString.data.length == 0) {
                        var permissionArray = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                    } else {
                        var conditionGroupPhaseArray = conditionGroupPhaseString.data[0];

                   
                        var permissionInt = parseInt(conditionGroupPhaseArray.phasePermission);
                        var phasePermission = permissionInt.toString(2);
                       
                        var temp = permissionInt.toString(2);
                        var permissionArray = ("0000000000000" + permissionInt.toString(2)).substring(temp.length , temp.length + 13).split("");
                    }

                    
                    
//                    var index = 0;

                    // navigation control
                    // permissionArray[12] = input data
                    // permissionArray[8] to permssionArray[11] = statistics
                    // permissionArray[7] to permissionArray[3] = community posts
                    // permissionArray[0] to permissionArray[2] = rewards section
                    if(permissionArray[12] == '0'){
                        $("#inputData").hide();
                    } 
                    else
                        $("#inputData").show();
                    if(permissionArray[11] == '0' && permissionArray[10] == '0' &&
                              permissionArray[9] == '0' && permissionArray[8] == '0') {
                        $("#statistics").hide();
                    } 
                    else
                        $("#statistics").show();
                    if(permissionArray[7] == '0' && permissionArray[6] == '0' &&
                              permissionArray[5] == '0' && permissionArray[4] == '0' &&
                              permissionArray[3] == '0') {
                        $('#communityPosts').hide();
                    }
                    else
                        $("#communityPosts").show();
                    if(permissionArray[2] == '0' && permissionArray[1] == '0' &&
                              permissionArray[0] == '0') {
                        $('#home-mid').hide();
                    }
                    else
                        $("#home-mid").show();
                    
                    // what's new control
                    if (permissionArray[0]  == '0') $("#progression").hide(); else $("#progression").show();
                    if (permissionArray[1]  == '0') $("#publicRewards").hide(); else $("#publicRewards").show();
                    if (permissionArray[2]  == '0') $("#privateRewards").hide(); else $("#privateRewards").show();
                    if (permissionArray[3]  == '0') $("#socialMediaTips").hide(); else $("#socialMediaTips").show();
                    if (permissionArray[4]  == '0') $("#subTeamTips").hide(); else $("#subTeamTips").show();
                    if (permissionArray[5]  == '0') $("#conditionGroupTips").hide(); else $("#conditionGroupTips").show();
                    if (permissionArray[6]  == '0') $("#adminTips").hide(); else $("#adminTips").show();
                    if (permissionArray[7]  == '0') $("#submitTips").hide(); else $("#submitTips").show();
                    if (permissionArray[8]  == '0') $("#socialMediaStats").hide(); else $("#socialMediaStats").show();
                    if (permissionArray[9]  == '0') $("#subTeamStats").hide(); else $("#subTeamStats").show();
                    if (permissionArray[10] == '0') $("#conditionGroupStats").hide(); else $("#conditionGroupStats").show();
                    if (permissionArray[11] == '0') $("#personalStats").hide(); else $("#personalStats").show();
                    if (permissionArray[12] == '0') $("#dataEntry").hide(); else $("#dataEntry").show();
                    
                    // hand out rewards
                    // first check if the user has permissions to earn rewards by looking at the public and private rewards permissions in 
                    // the permissions page. If neither permissions is set than do not display any rewards on page. Otherwise, display the
                    // rewards that the user has earned
               
                    $('#rewardsSection').show();
                    if (permissionArray[1] == '0' && permissionArray[2] == '0') {
                        // no permission for rewards
                        $('#rewardsSection').hide();
                    }
                    else {


                        // fill out rewards that the user has earned by looking at the user's accumulated statistics and using the REWARDS_MATRIX
                        // determine at which level of reward for entries, posts and likes the user deserves
                        //var rewardsMessage = "Congratulations on your rewards!";
                        var entriesNumTotal = userArray.entriesNumTotal;
                        var postsNumTotal = userArray.postsNumTotal;
                        var likesNumTotal = userArray.likesNumTotal;
                        
                        // do rewards for all metrics by first rendering all the badges then determining what
                        // motivation message to use. The highest level motivation message is used.
                        highestRewardMessage = "Sorry, you have not earned any rewards";
                        entriesRewards = REWARDS_MATRIX.entries;
                        postsRewards = REWARDS_MATRIX.posts;
                        likesRewards = REWARDS_MATRIX.likes;
                        
                        // render badges
                        entriesRewardLevel = renderRewards(entriesNumTotal, REWARDS_MATRIX.entries);
                        postsRewardLevel = renderRewards(postsNumTotal, REWARDS_MATRIX.posts);
                        likesRewardLevel = renderRewards(likesNumTotal, REWARDS_MATRIX.likes);
                        
                        // determine what is the highest level badge and from what metric
                        if (entriesRewardLevel >= postsRewardLevel && entriesRewardLevel >= likesRewardLevel) {
                            // entries has the highest reward
                            highestRewardLevel = entriesRewardLevel;
                            metric = REWARDS_MATRIX.entries;
                        }
                        else if (postsRewardLevel >= likesRewardLevel) {
                            // posts has the highes level
                            highestRewardLevel = postsRewardLevel;
                            metric = REWARDS_MATRIX.posts;
                        }
                        else {
                            // likes has the highest level
                            highestRewardLevel = likesRewardLevel;
                            metric = REWARDS_MATRIX.likes;
                        }
                        
                        // get the message
                        if (highestRewardLevel == 1)
                            highestRewardMessage = metric.bronzeMessage;
                        else if  (highestRewardLevel == 2)
                            highestRewardMessage = metric.silverMessage;
                        else if  (highestRewardLevel == 3)
                            highestRewardMessage = metric.goldMessage;
                        else if  (highestRewardLevel == 4)
                            highestRewardMessage = metric.platinumMessage; 
                        $("#rewardMessage").html(highestRewardMessage);
                    }
             
                });
            });
        }
    });
} // end function


function renderRewards(totalAchieved, rewards) {
    img1Str = "<img src='";
    img2Str = "' alt='missing image' height='100' width='100'>";
    highestLevel = 0;
    
    // do bronze awards
    if (totalAchieved >= rewards.bronze) {
        highestLevel = 1;
        $("#" + rewards.name + "RewardRow").append(img1Str + rewards.bronzeReward + img2Str);
    }
    // do silver awards
    if (totalAchieved >= rewards.silver) {
        highestLevel = 2;
        $("#" + rewards.name + "RewardRow").append(img1Str + rewards.silverReward + img2Str);
    }
    // do gold awards
    if (totalAchieved >= rewards.gold) {
        highestLevel = 3;
        $("#" + rewards.name + "RewardRow").append(img1Str + rewards.goldReward + img2Str);
    }
    // do platinum awards
    if (totalAchieved >= rewards.platinum) {
        highestLevel = 4;
        $("#" + rewards.name + "RewardRow").append(img1Str + rewards.platinumReward + img2Str);
    }
    
    return highestLevel;
}                        
       