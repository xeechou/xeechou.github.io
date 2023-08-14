// ==UserScript==
// @namespace https://xeechou.net/gmscripts
// @name      Blocking youtube play list
// @version   1
// @grant     GM_addStyle
// @include   https://www.youtube.com/*
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

//blocking the play next
GM_addStyle("#secondary {display:none}");
//block front page grids
//GM_addStyle(".ytd-two-column-browse-results-renderer {display:none}"); //this disables everything
GM_addStyle(".ytd-rich-grid-renderer {display:none}"); //disable the front page where it recommands you stuff
