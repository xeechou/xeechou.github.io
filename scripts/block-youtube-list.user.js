// ==UserScript==
// @name        Blocking youtube play list
// @namespace   https://xeechou.net/gmscripts
// @description Blocking addictive click baits on youtube
// @version     0.4
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

function getBrowserName() {
  let browserInfo = navigator.userAgent;
  let browser;
  if (browserInfo.includes('Opera') || browserInfo.includes('Opr')) {
    browser = 'Opera';
  } else if (browserInfo.includes('Edg')) {
    browser = 'Edge';
  } else if (browserInfo.includes('Chrome')) {
    browser = 'Chrome';
  } else if (browserInfo.includes('Safari')) {
    browser = 'Safari';
  } else if (browserInfo.includes('Firefox')) {
    browser = 'Firefox';
  } else {
    browser = 'unknown';
  }
  return browser;
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

//block only certain urls
function GM_addStyleMatchURLs(css, urls) {
    if (MatchURLs(urls)) {
	GM_addStyle(css);
    }
}


//blocking the play next
//somehow chrome moves comments to the side now.
const div = (getBrowserName() == 'Chrome') ? '#below' : '#secondary';
const style = [div, "{display:none}"].join(' ');
GM_addStyle(style);

// this disable the rich grid for certain types
//GM_addStyle("#secondary {display:none}");
//GM_addStyle("#below {display:none}");

//block front page grids
//GM_addStyle(".ytd-two-column-browse-results-renderer {display:none}"); //this disables everything

//disable the front page where it recommands you stuff
GM_addStyleMatchURLs(".ytd-rich-grid-renderer {display:none}", ["https://youtube.com/", "https://www.youtube.com/"]);
