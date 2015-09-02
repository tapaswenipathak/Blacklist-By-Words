// Don't trigger hideForMe(), manipulate the dom in hideForMe() :D
var lock = false;

var facebookStoryClass = ".userContentWrapper";
var hideForMe = function(regex) {
    if (lock) {
        return;
    }
    lock = true;
    jQuery(facebookStoryClass + ":not(.HidePost)")
        .filter(function() {

            //Handles adding words not more than once per story
            //https://api.jquery.com/closest/ :)
            if (jQuery(this).closest(facebookStoryClass + ".HidePost").length > 0) {
                return false;
            }
            var matches = regex.exec(this.textContent);
            if (matches !== null) {
                var matchingString = matches.join(", ");
                var story = jQuery(this);
                story.addClass("HidePost");
                story.parent().addClass("HidePost");

                // Insert the list of matched words
                var div = jQuery("<div></div>")
                    .addClass("HidePost_matches")
                    .text(matchingString);
                div.appendTo(jQuery(this));
                div.css("top", -1 * story.outerHeight() / 2.0);
                div.css("left", (story.outerWidth() / 2.0) - div.width());

                return true;
            }
            return false;
        })
        .addClass("HidePost");
    lock = false;
}

//Credit : http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
function escape(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function makeRegex(block_keywords) {

    //Comma separated, optional white spaces.
    var bannedWords = block_keywords.split(/,\s*/);
    // Only match on word boundaries
    bannedWords = bannedWords.map(function(word) { return "\\b" + escape(word) + "\\b"; });
    return new RegExp(bannedWords.join("|"), "i");
}

//Thanks, http://stackoverflow.com/a/14533446

chrome.storage.sync.get("HidePost_block_keywords", function(response) {
    var block_keywords = response["HidePost_block_keywords"];
    if (block_keywords) {
        var regex = makeRegex(block_keywords);
        document.addEventListener("DOMNodeInserted", function() {
            // Slow, damn slow!
            hideForMe(regex);
        });
        hideForMe(regex);
    }
});
