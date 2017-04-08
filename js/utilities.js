// functions and constants shared by multiple pages go here

// load a view
function viewManager(file){
	$("#viewGoesHere").load(file);
}


// save text as a file in the download directory
function saveTextToFile(toSaveAsFilename, textToSave) {
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
 
    var downloadLink = document.createElement("a");
    downloadLink.download = toSaveAsFilename;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
//    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
}

// TO DO: Rewards matrix. This really should not be hard coded and be on a per studies basis in a Database. A page should also
// support the modification of these metrics on a per study basis - perhaps the create studies and/or manage studies page.
var REWARDS_MATRIX = {
      entries: {
        name: 'entries',
        bronze:10,     bronzeReward:'img/rewards/bronze.jpg',    bronzeMessage: '',
        silver:20,     silverReward:'img/rewards/silver.jpg',    silverMessage: '',
        gold:30,       goldReward:'img/rewards/gold.jpg',      goldMessage: '',
        platinum:40,   platinumReward:'img/rewards/platinum.jpg',  platinumMessage: ''},
      posts: {
        name: 'posts',
        bronze:10,     bronzeReward:'img/rewards/bronze.jpg',    bronzeMessage: '',
        silver:20,     silverReward:'img/rewards/silver.jpg',    silverMessage: '',
        gold:30,       goldReward:'img/rewards/gold.jpg',      goldMessage: '',
        platinum:40,   platinumReward:'img/rewards/platinum.jpg',  platinumMessage: ''},
      likes: {
        name: 'likes',
        bronze:10,     bronzeReward:'img/rewards/bronze.jpg',    bronzeMessage: '',
        silver:20,     silverReward:'img/rewards/silver.jpg',    silverMessage: '',
        gold:30,       goldReward:'img/rewards/gold.jpg',      goldMessage: '',
        platinum:40,   platinumReward:'img/rewards/platinum.jpg',  platinumMessage: ''}
};  
