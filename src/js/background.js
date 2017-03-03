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

        
/*
        console.log("--- tabArray[0] ---");
        console.log(tabArray[0]);

        // ToDo: should parse out the domain and compare on that.
        if (tabArray[0].url.indexOf('http://www.kijiji.ca/') === 0 || tabArray[0].url.indexOf('https://www.kijiji.ca/') === 0) {
          console.log("--- found Kijiji.ca ---");
          for (index = 0; index < filterDomains.length; index++) {
            var filter = filterDomains[index].replace(/\//g, "\\/");
            filter = filter.replace(/\x2e/g, "\\.");
            filter = filter.replace(/\x2a/g, ".");
            //console.log(filter);
            var patt = new RegExp(filter);
            var res = patt.test(info.url);
            if (res) {
              console.log("!!! found Ad Network !!!");
              return {cancel: true};
            }
          }
          console.log("NOT an AD NETWORK == " + info.url);
        }

        console.log("END -- chrome.tabs.query()");
        return {cancel: false};
      }
    );
*/
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
