// ==UserScript==
// @name        Blocking sidebar play list
// @namespace   https://xeechou.net/gmscripts
// @description Blocking addictive click baits on youtube/Bilibili
// @version     0.4
// @grant       GM_addStyle
// @match       https://www.youtube.com/*
// @match       https://youtube.com/*
// @match       https://bilibili.com/*
// @match       https://www.bilibili.com/*
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
    if (curr_url.match(urls[i])) {
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


const display_none = '{display:none !important}';


//// Youtube
const ytb_list = ["https://youtube.com/", "https://www.youtube.com/"];

// disable the sidbar click baits
const div = (getBrowserName() == 'Chrome') ? '#below' : '#secondary';
const style = [div, display_none].join(' ');
GM_addStyleMatchURLs(style, ytb_list);

//disable the front page where it recommands you stuff
GM_addStyleMatchURLs(".ytd-rich-grid-renderer {display:none !important}", ytb_list);

//// Bilibili
const bili_list = ["https://bilibili.com/", "https://www.bilibili.com/"];
// Blocking bilibili Side bars
GM_addStyleMatchURLs("#reco_list {display:none !important}", bili_list);
// Blocking floor ads
GM_addStyleMatchURLs(".recommend-list-v1  {display:none !important}", bili_list);
// Blocking ads
GM_addStyleMatchURLs(".ad-report {display:none !important}", bili_list);
// Blocking pop live
GM_addStyleMatchURLs(".pop-live-small-mode {display:none !important}", bili_list);

