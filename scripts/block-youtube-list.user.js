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

GM_addStyle("#secondary {display:none}");
