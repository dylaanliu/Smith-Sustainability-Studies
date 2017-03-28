// functions shared by multiple pages go here

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
