// functions shared by multiple pages go here

// load a view or do this in the script - get rid of
function viewManager(file){
	$("#viewGoesHere").load(file);
}

/*// load specific controllers for views
function loadUserHomeScript(){
    $.getScript('js/user-home-ctr.js');
}

function loadUserInputDataScript(){
    $.getScript('js/user-input-data-ctr.js');
}

function loadUserStatisticsScript(){
	$.getScript('js/user-statistics-ctr.js');
}*/

// replace with logout php function call
$("#logout").click(function(){
    alert("Logging out");
});

