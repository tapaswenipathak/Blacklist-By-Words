// Don't trigger hideForMe(), manipulate the dom in hideForMe() :D
var lock = false;
var block_keywords;
var regex;

var facebookStoryClass = ".userContentWrapper";
// var hideForMe = function(regex) {
//     if (lock) {
//         return;
//     }
//     lock = true;
//     jQuery(facebookStoryClass + ":not(.HidePost)")
//         .filter(function() {
//
//             //Handles adding words not more than once per story
//             //https://api.jquery.com/closest/ :)
//             if (jQuery(this).closest(facebookStoryClass + ".HidePost").length > 0) {
//                 return false;
//             }
//             var matches = regex.exec(this.textContent);
//             if (matches !== null) {
//                 var matchingString = matches.join(", ");
//                 var story = jQuery(this);
//                 story.addClass("HidePost");
//                 story.parent().addClass("HidePost");
//
//                 // Insert the list of matched words
//
//
//                 return true;
//             }
//             return false;
//         })
//         .addClass("HidePost");
//     lock = false;
// }
/*
Heart of the app
Function to loop through all the showing user feed container if pattern match hide it/replace it with content whatever you want.
else do nothing
*/
function hidePost(){
  $('.userContentWrapper').each(function(){
     var matches = regex.exec($(this).find('p').eq(0).html()); //text regex on the pargraph content of post
     if (matches !== null) { //if matches
      //  console.log('matchfound');
         var story = $(this);
         var matchingString = matches.join(", ");
         var div = $("<div></div>")
         .addClass("HidePost_matches")
         .text(matchingString);       // Insert the list of matched words
        // div.css("top", -1 * story.outerHeight() / 2.0);
      //   div.css("left", (story.outerWidth() / 2.0) - div.width());
      ///  console.log(div);
          $(this).css('background-color','#F69C55');
          $(this).empty();
          $(this).append(div);
    }
  })
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

$(document).ready(function(){
    hidePost() // call only on ready funciton instead of DOMNodeInserted which makes it very very slow because it read all the dom elements
});

$(window).scroll(function (event) {
    hidePost() //so on scroll new user feed will be updated, we should read those as well to hide by keywords
});

//Thanks, http://stackoverflow.com/a/14533446

chrome.storage.sync.get("HidePost_block_keywords", function(response) {
     block_keywords = response["HidePost_block_keywords"];
     if (block_keywords) {
          regex = makeRegex(block_keywords);
    //     // document.addEventListener("DOMNodeInserted", function() {
    //     //   console.log($('body').html())
    //     //     // Slow, damn slow!
    //     //   //  hideForMe(regex);
    //     // });
    //     //hideForMe(regex);
     }
});
