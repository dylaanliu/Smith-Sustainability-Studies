$("#admin-logout").click(function(){
    var logoutController = "server/admin-user-template-ctr.php";
    var controllerData = { q: "logout"};

    var response = confirm("Do you really want to log out?");
    if (!response) {
        return false;
    }

    // clear local storage
    localStorage.clear(); 
    sessionStorage.clear(); 

            // inform server to logout
    $.getJSON(logoutController, controllerData, function(result) {
        console.log(JSON.stringify(result));
        if (result.error) {
            alert ("Logout Failed!");
        }
        else {
            window.location.href = location.origin + result.redirect;
        }
    }); 
});
