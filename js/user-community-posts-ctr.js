$(document).ready(function() {
    
}); // end function

function loadUserCommunityView() {
    $(".nav li").removeClass("active");
    $(".nav li #communityPosts").addClass("active");

//  var data_file = "adminhome.json"; // path to temp json file
    var controller = "server/user-community-posts-ctr.php";
    var conditionGroupNum = localStorage.getItem("CurrentConditionGroup");
    var studyID = localStorage.getItem("studyID");
    var currentPhase = localStorage.getItem("currentPhase");
    //var permissions = localStorage.getItem("")
    console.log("condition group: "+conditionGroupNum);
    console.log("study: "+studyID);
    console.log("phase: "+currentPhase);
    var postsQuery = { q: "something", conditionGroupNum: conditionGroupNum, studyID: studyID, currentPhase: currentPhase};
    var view = "views/user-community-posts-view.html";
    
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            $.getJSON(controller, postsQuery, function(postsString) {
                console.log(postsString.posts.length);

                insertHTML(postsString);
            });
            console.log("out of get");
        } // end if
    }); // end load
} // end function

function insertHTML(postsString){
    if (postsString.posts.length == 0) {
        $("#accordion").append(
            "<h4> No posts to display </h4>"
        );
    } else {
        var postsArray = $.map(postsString.posts, function(el){
            return el;
        });

        // sort by date
        postsArray.sort(function(postA, postB){
            return postA.dateTimeStamp - postB.dateTimeStamp;
        });

        $.each(postsArray, function(key, post){
            console.log("post :"+post);
            var date = new Date(post.dateTimeStamp);
            if(post.image != "" && post.image != null) {
                $("#accordion").append(
                "<div class='panel panel-default'>"+
                    "<div class='panel-heading'>"+
                        "<h4 class='panel-title'>"+
                            "<a class='accordion-toggle' data-toggle='collapse' href='#collapse-"+post.postID+"'>"+
                                post.userName+" <small><i>"+date.toLocaleString()+"</i></small>"+
                            "</a>"+
                        "</h4>"+
                    "</div>"+
                    "<div id='collapse-"+post.postID+"' class='panel-collapse collapse collapse in'>"+
                        "<div class='panel-body'>"+
                            "<p id='text'>"+post.text+"</p>"+
                            "<img src="+post.image+" class='media-object' style='width:80px'>"+
                        "</div>"+
                    "</div>"+
                "</div>");
            } else {
                $("#accordion").append(
                "<div class='panel panel-default'>"+
                    "<div class='panel-heading'>"+
                        "<h4 class='panel-title'>"+
                            "<a class='accordion-toggle' data-toggle='collapse' href='#collapse-"+post.postID+"'>"+
                                post.userName+" <small><i>"+date.toLocaleString()+"</i></small>"+
                            "</a>"+
                        "</h4>"+
                    "</div>"+
                    "<div id='collapse-"+post.postID+"' class='panel-collapse collapse collapse in'>"+
                        "<div class='panel-body'>"+
                            "<p id='text'>"+post.postText+"</p>"+
                            
                        "</div>"+
                    "</div>"+
                "</div>");
            }

            $("#accordion").append(
                "<div class='media-footer'"+
                    "<p>where share buttons and like go</p>"+
                //"</div>"+
            "</div>");

     
        }); // end each

        console.log("before submit button code");
        $("#post-form").submit(function(event){
            //var dateTime = Date();
            var text = $("#post-input").val();
            //var CurrentConditionGroup = localStorage.getItem("CurrentConditionGroup");
            //var currentPhase = localStorage.getItem("currentPhase");
            console.log(text);
            event.preventDefault();

            if(text=="") {
                alert("Please enter some text");
            } else {
                $.ajax({
                    url: "server/user-community-posts-ctr.php",
                    type: 'POST',
                    data: {text1: text, image1: image, conditionGroupNum1: conditionGroup, phaseNum1: currentPhase, studyID1: studyID},
                    dataType: 'json',
                    success: function (result, status) {
                        console.log('errorMsg='+result.errorMsg);
                        console.log(JSON.stringify(result));

                        if(result.error){
                            alert(result.errorMsg);
                        } else {
                            alert("New post made!");
                            // see if can do a soft refresh to get updated posts
                        }
                    }, 
                    error: function(jqXHR, exception){
                        console.log(jqXHR);
                        console.log(exception);
                        //console.log(xhr);
                        console.log("Something went wrong");
                    }
                });

/*
                console.log("going to submit...");
                $.post("server/user-community-posts-ctr.php", {text1: text, image1:null, 
                                                                conditionGroupNum1: conditionGroupNum, phaseNum1: currentPhase}, "json")
                .done(function(responseTxt, statusTxt, xhr){
                    console.log(responseTxt);
                    console.log(statusTxt);
                    console.log(xhr);
                });*/
            } // end else
        });
    }
    console.log("after submit button code");
}

$("#viewGoesHere").on("click", "#community-top a[name='user-post-form']", function(){
    var text = $("#post-input").val();
    var image = null;
    var conditionGroup = localStorage.getItem("CurrentConditionGroup");
    var currentPhase = localStorage.getItem("currentPhase");
    var studyID = localStorage.getItem("studyID");
    console.log(text);
    event.preventDefault();

    if(text=="") {
        alert("Please enter some text");
    } else {
        $.ajax({
            url: "server/user-community-posts-ctr.php",
            type: 'POST',
            data: {text1: text, image1: image, conditionGroupNum1: conditionGroup, phaseNum1: currentPhase, studyID1: studyID},
            dataType: 'json',
            success: function (result, status) {
                console.log('errorMsg='+result.errorMsg);
                console.log(JSON.stringify(result));

                if(result.error){
                    alert(result.errorMsg);
                } else {
                    alert("New post made!");
                    // see if can do a soft refresh to get updated posts
                }
            }, 
            error: function(jqXHR, exception){
                console.log(jqXHR);
                console.log(exception);
                //console.log(xhr);
                console.log("Something went wrong");
            }
        });
    }
    return false; // ajax used, block the normal submit
});

