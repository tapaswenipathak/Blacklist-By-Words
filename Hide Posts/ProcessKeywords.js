//Thanks : http://stackoverflow.com/questions/5364062/how-can-i-save-information-locally-in-my-chrome-extension

function save() {
    var block_keywords = document.getElementById("block_keywords").value;
    current_status.innerHTML = "Saving...";
    chrome.storage.sync.set({"HidePost_block_keywords": block_keywords}, function() {

        var current_status = document.getElementById("current_status");
        current_status.innerHTML = "Saved. :)";
        setTimeout(function() {
            current_status.innerHTML = "";
        }, 750);
    });
}

function restore() {
    chrome.storage.sync.get("HidePost_block_keywords", function(response) {
        var block_keywords = response["HidePost_block_keywords"];
        if (!block_keywords) {
            block_keywords = getSampleblock_keywords();
        }
        document.getElementById("block_keywords").value = block_keywords;
    });
}


//Insert sample words
function getSampleblock_keywords() {
    var sampleblock_keywords = [
       "BJP",
       "You will not believe what happened next",
       "Salman Khan" 
    ];
    return sampleblock_keywords.join(", ");    
}

document.addEventListener("DOMContentLoaded", function() {
    restore();    
    document.getElementById("save").addEventListener('click', save);
});