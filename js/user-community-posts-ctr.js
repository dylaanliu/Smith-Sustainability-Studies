/*$(document).ready(function() {

    loadUserCommunityView();
    
}); // end function*/

function loadUserCommunityView() {
    $(".nav li").removeClass("active");
    $(".nav li #communityPosts").addClass("active");

//  var data_file = "adminhome.json"; // path to temp json file
    var controller = "server/user-community-posts-ctr.php";
    var postsQuery = { q: "something"};
    var view = "views/user-community-posts-view.html";
    
    $("#viewGoesHere").load(view, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        if(statusTxt == "success") {
            $.getJSON(controller, postsQuery, function(postsString) {
                console.log("in get");
                insertHTML(postsString);
            });
            console.log("out of get");
        } // end if
    }); // end load
} // end function

function insertHTML(postsString){

    console.log("entering inserting html");
    var postsArray = $.map(postsString, function(el){
        return el;
    });

    // sort by date
    postsArray.sort(function(postA, postB){
        return postA.dateTime - postB.dateTime;
    });

    console.log("inserting html");
    $.each(postsArray, function(key, post){
        var date = new Date(post.dateTime);
        if(post.image != "") {
            $("#accordion").append(
            "<div class='panel panel-default'>"+
                "<div class='panel-heading'>"+
                    "<h4 class='panel-title'>"+
                        "<a class='accordion-toggle' data-toggle='collapse' href='#collapse-"+post.postId+"'>"+
                            post.username+" <small><i>"+date.toLocaleString()+"</i></small>"+
                        "</a>"+
                    "</h4>"+
                "</div>"+
                "<div id='collapse-"+post.postId+"' class='panel-collapse collapse collapse in'>"+
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
                        "<a class='accordion-toggle' data-toggle='collapse' href='#collapse-"+post.postId+"'>"+
                            post.username+" <small><i>"+date.toLocaleString()+"</i></small>"+
                        "</a>"+
                    "</h4>"+
                "</div>"+
                "<div id='collapse-"+post.postId+"' class='panel-collapse collapse collapse in'>"+
                    "<div class='panel-body'>"+
                        "<p id='text'>"+post.text+"</p>"+
                        
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
        console.log("preparing to submit..");
        var dateTime = Date();
        var text = $("#post-input").val();
        var CurrentConditionGroup = localStorage.getItem("CurrentConditionGroup");
        var currentPhase = localStorage.getItem("currentPhase");
        console.log(text);
        event.preventDefault();

        if(text=="") {
            alert("Please enter some text");
        } else {
            console.log("going to submit...");
            $.post("server/user-community-posts-ctr.php", {dateTime1: dateTime, text1: text, image1:null, 
                                                            conditionGroupNum1: CurrentConditionGroup, phaseNum1: currentPhase}, "json")
            .done(function(responseTxt, statusTxt, xhr){
                console.log(responseTxt);
                console.log(statusTxt);
                console.log(xhr);
            });
        }
    });

    console.log("after submit buttone code");
}

