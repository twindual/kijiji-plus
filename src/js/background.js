/*!
 * Kijiji+ Site Enhancer v1.0.0 (https://github.com/twindual/kijiji-plus)
 * Copyright 2017 André Fortin.
 * Licensed under the GNU GPL (http://www.gnu.org/licenses/)
 */
var filterDomains = [
  "*://*.adnxs.com/*",
  "*://dis.aspx/*",
  "*://bat.bing.com/*",
  "*://as.casalemedia.com/*",  
  "*://widget.criteo.com/*",
  "*://*.criteo.net/js/ld/*",
  "*://prebid.districtm.ca/*",
  "*://*.g.doubleclick.net/*",
  "*://pulsar.ebay.com/plsr/mpe/*",
  "*://pixel.everesttech.net/*",
  "*://*.google.ca/ads/*",
  "*://*.google.com/adsense/search/*",
  "*://*.google-analytics.com/analytics.js",
  "*://*.google-analytics.com/plugins/ua/*",
  "*://*.googleadservices.com/pagead/*",
  "*://*.googlesyndication.com/safeframe/*",
  "*://*.googletagmanager.com/*",
  "*://*.googletagservices.com/tag/js/*",
  "*://kijiji-d.openx.net/*",
  "*://us-u.openx.net/*",
  "*://cdn.optimizely.com/*",
  "*://ads.pubmatic.com/*",
  "*://gads.pubmatic.com/*",
  "*://b.scorecardresearch.com/*"
];

var activeTab;
function doInCurrentTab(tabCallback) {
  var result = chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabArray) {
        console.log("--- tabArray[0] ---");
        console.log(tabArray[0]);
      return tabArray[0];
    }
  );

  return result;
}

chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    //console.log("Ad Network Intercepted: " + info.url);
    return {cancel: true};
  },
  // filters
  {
    urls: filterDomains
  },
  // extraInfoSpec
  ["blocking"]);


chrome.webRequest.onBeforeSendHeaders.addListener(
  function(info) {
    //console.log("Ad Network Intercepted - MARK II: " + info.url);
    return {cancel: true};
  },
  // filters
  {
    urls: filterDomains
  },
  // extraInfoSpec
  ["blocking", "requestHeaders"]);

// Display options page when button clicked.
chrome.browserAction.onClicked.addListener(
  function(tab) {
    if (chrome.runtime.openOptionsPage) {
      // New way to open options pages, if supported (Chrome 42+).
      chrome.runtime.openOptionsPage();
    } else {
      // Reasonable fallback.
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
