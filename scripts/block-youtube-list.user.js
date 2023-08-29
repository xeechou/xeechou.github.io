// ==UserScript==
// @name        Blocking youtube play list
// @namespace   https://xeechou.net/gmscripts
// @description Blocking addictive click baits on youtube
// @version     0.3
// @grant       GM_addStyle
// @match       https://www.youtube.com/*
// @match       https://youtube.com/*
// ==/UserScript==


function GM_addStyle(css) {
  const style = document.getElementById("GM_addStyleBy8626") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy8626";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

function MatchURLs(urls) {
    const curr_url = window.location.href;
    for (let i =0; i < urls.length; i++) {
	if (curr_url == urls[i]) {
	    return true;
	}
    }
    return false;
}

function GM_addStyleMatchURLs(css, urls) {
    if (MatchURLs(urls)) {
	GM_addStyle(css);
    }
}


//blocking the play next
GM_addStyle("#secondary {display:none}");
//block front page grids
//GM_addStyle(".ytd-two-column-browse-results-renderer {display:none}"); //this disables everything

//disable the front page where it recommands you stuff
GM_addStyleMatchURLs(".ytd-rich-grid-renderer {display:none}", ["https://youtube.com/", "https://www.youtube.com/"]);
