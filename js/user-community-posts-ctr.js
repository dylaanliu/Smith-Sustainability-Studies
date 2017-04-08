$(document).ready(function() {
    
}); // end function

function loadUserCommunityView() {
    $(".nav li").removeClass("active");
    $("#communityPosts").addClass("active");

//  var data_file = "adminhome.json"; // path to temp json file
    var controller = "server/user-community-posts-ctr.php";
    var conditionGroupNum = localStorage.getItem("CurrentConditionGroup");
    var studyID = localStorage.getItem("studyID");
    var currentPhase = localStorage.getItem("currentPhase");
    var postsQuery = { q: "something", conditionGroupNum: conditionGroupNum, studyID: studyID, currentPhase: currentPhase};
    var view = "views/user-community-posts-view.html";
    
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            $.getJSON(controller, postsQuery, function(postsString) {
                //console.log(postsString.posts.length);
                // console.log(JSON.stringify(postsString));
                insertHTML(postsString);
            });
            //console.log("out of get");
        } // end if
    }); // end load
} // end function

function insertHTML(postsString){
    if (postsString.posts.length == 0) {
        $("#accordion").append(
            "<h4> No posts to display </h4>"
        );
    } else {

        $.each(postsString.posts, function(key, post){
            //console.log("post :"+post);
            var date = new Date(post.dateTimeStamp);
            if(post.image != "" && post.image != null) {
                $("#accordion").append(
                "<div class='panel panel-default'>"+
                    "<div class='panel-heading'>"+
                        "<div class='panel-title'>"+
                            "<a class='accordion-toggle' data-toggle='collapse' href='#collapse-"+post.postID+"'>"+
                                "<div class='h5' style='display: inline;'>" +
                                    "<b>"+post.userName+"</b>"+
                                    "<h6 class='text-muted pull-right'>"+date.toLocaleString() +"</h6>" +
                                "</div>"+
                            "</a>"+
                        "</div>"+
                    "</div>"+
                    "<div id='collapse-"+post.postID+"' class='panel-collapse collapse collapse in'>"+
                        "<div class='panel-body'>"+
                            "<p id='text'>"+post.text+"</p>"+
                            "<img src="+post.image+" class='media-object' style='width:80px'>"+
                        "</div>"+

                        "<div class='media-footer'"+
                            "<div class='like-button'>"+
                                "<a href='#' id='likePost-"+post.postID+"'class='button button-like' name='button-like'>"+
                                    "<i class='pe-7s-like2'</i>"+
                                    "<span id='post_like'>Like</span>"+
                                "</a>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>");
            } else {
                $("#accordion").append(
                "<div class='panel panel-default'>"+
                    "<div class='panel-heading'>"+
                        "<div class='panel-title'>"+
                            "<a class='accordion-toggle' data-toggle='collapse' href='#collapse-"+post.postID+"'>"+
                                "<div class='h5' style='display: inline;'>" +
                                    "<b>"+post.userName+"</b>"+
                                    "<h6 class='text-muted pull-right'>"+date.toLocaleString() +"</h6>"+
                                "</div>"+
                            "</a>"+
                        "</div>"+
                    "</div>"+
                    "<div id='collapse-"+post.postID+"' class='panel-collapse collapse collapse in'>"+
                        "<div class='panel-body'>"+
                            "<p id='text'>"+post.postText+"</p>"+
                        "</div>"+
                        "<div class='media-footer'"+
                            "<div class='like-button'>"+
                                "<a href='#' id='likePost-"+post.postID+"'class='button button-like' name='button-like'>"+
                                    "<i class='pe-7s-like2'</i>"+
                                    "<span id='post_like'>Like</span>"+
                                "</a>"+
                            "</div>"+
                        "</div>"+

                    "</div>"+
                "</div>");
            }
     
        }); // end each

        //console.log("before submit button code");
        $("#post-form").submit(function(event){
            //var dateTime = Date();
            var text = $("#post-input").val();
            //var CurrentConditionGroup = localStorage.getItem("CurrentConditionGroup");
            //var currentPhase = localStorage.getItem("currentPhase");
           // console.log(text);
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
                      /*  console.log('errorMsg='+result.errorMsg);
                        console.log(JSON.stringify(result));*/

                        if(result.error){
                            alert(result.errorMsg);
                        } else {
                            alert("New post made!");
                            // see if can do a soft refresh to get updated posts
                        }
                    }, 
                    error: function(jqXHR, exception){
                        /*console.log(jqXHR);
                        console.log(exception);*/
                        //console.log(xhr);
                        console.log("Something went wrong");
                    }
                });
            } // end else
        });
    }
    //console.log("after submit button code");
}

$("#viewGoesHere").on("click", "#community-top a[name='user-post-form']", function(){
    
    var controller = "server/user-community-posts-ctr.php";    
    var text = $("#post-input").val();
    var image = null;
    var conditionGroup = localStorage.getItem("CurrentConditionGroup");
    var currentPhase = localStorage.getItem("currentPhase");
    var studyID = localStorage.getItem("studyID");
    var postsQuery = { q: "something", conditionGroupNum: conditionGroup, studyID: studyID, currentPhase: currentPhase};
    //console.log(text);
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
                /*console.log('errorMsg='+result.errorMsg);
                console.log(JSON.stringify(result));
*/
                if(result.error){
                    alert(result.errorMsg);
                } else {
                    $.getJSON(controller, postsQuery, function(postsString) {
                        $("#post-input").val("");
                        //console.log(postsString.posts.length);
                        $("#accordion").empty();
                        insertHTML(postsString);
                    });
                    //                    alert("New post made!");
                    // see if can do a soft refresh to get updated posts
                }
            }, 
            error: function(jqXHR, exception){
               /* console.log(jqXHR);
                console.log(exception);*/
                //console.log(xhr);
                console.log("Something went wrong");
            }
        });
    }
    return false; // ajax used, block the normal submit
});


$("#viewGoesHere").on("click", "#community-bottom a[name='button-like']", function (e) {
    var postID = this.id;
    var dataObject;

    e.preventDefault();
    $(this).closest('.button').toggleClass('selected');

    if ($("#" + postID + " #post_like").html() == "Like") {
        $("#" + postID + " #post_like").html("Unlike");
        dataObject = {cmd: 'incr'};
    }
    else { 
        $("#" + postID + " #post_like").html("Like");
        dataObject = {cmd: 'decr'};
    }
    
    // document.getElementById(postID).toggleClass('selected');
    // alert("like "+postID+" pressed!");

    $.ajax({
        url: "server/user-community-posts-ctr.php",
        type: 'PUT',
        dataType: 'text',
        data: dataObject,
        contentType: "application/json; charset=utf-8",
        success: function(result, textStatus, xhr) {
            var data = jQuery.parseJSON(result);
            //console.log('errorMsg=' + data.errorMsg);
            if (data.error)
                alert(data.errorMsg);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Like Operation');           
        }             
    });
});
