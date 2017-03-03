/*!
 * Kijiji+ Site Enhancer v1.0.0 (https://github.com/twindual/kijiji-plus)
 * Copyright 2017 André Fortin.
 * Licensed under the GNU GPL (http://www.gnu.org/licenses/)
 */

// Default Kijiji+ settings that should be the same as those used in options.js for consistency.
var settings = {
  enableDebugOutput: {
    type: 'checkbox',
    value: true
  },
  enableKijijiCaptchaSolver: {
    type: 'checkbox',
    value: true
  },
  enableKijijiContactPoster: {
    type: 'checkbox',
    value: true
  },  
  enableKijijiImageRotate: {
    type: 'checkbox',
    value: true
  },
  enableKijijiInfinityScroll: {
    type: 'checkbox',
    value: true
  },
  enableKijijiMapPreview: {
    type: 'checkbox',
    value: true
  },
  filterKijijiAlerts: {
    type: 'checkbox',
    value: true
  },
  filterKijijiFooterLinks: {
    type: 'checkbox',
    value: true
  },
  filterKijijiSocialLinks: {
    type: 'checkbox',
    value: true
  },
  filterKijijiThirdParty: {
    type: 'checkbox',
    value: true
  },
  filterKijijiTopAds: {
    type: 'checkbox',
    value: true
  },
  mapZoomLevel: {
    type: 'number',
    value: 15
  },
  userEmail: {
    type: 'text',
    value: ''
  },
  userName: {
    type: 'text',
    value: ''
  },
  userPhone: {
    type: 'text',
    value: ''
  },
  userCopyMe: {
    type: 'checkbox',
    value: true
  }
};

// Insert the 'Listing' and 'Map' view toggle buttons.
function insertViewOptions() {
  logMessage("insertDisplayToggle", "INIT", "info");

  // Right now its just the 'List' view but I still like the way it looks.
  // This comes from the 'Real Estate' section of Kijiji.
  if (!$('div.top-bar > div.display-toggle').length) {
    $('div.top-bar').prepend(
        '<div class="display-toggle" style="display: block;">'
      + '' //       <a id="MapLink" class="map link page-tip-trigger" href="/map-apartments-condos/dartmouth/c37l1700109r1.0?ad=offering&amp;ll=44.673570,-63.566740" data-content="KijijiAlertTooltip" data-position-my="bottom center" data-position-at="top center"><div class="icon"></div>Map</a>
      + '    <a class="list" style="margin-top: 5px; padding-top: 3px;"><div class="icon"></div>List</a>'
      + '</div>'
    );
  }
}

// Insert listing result navigation buttons on the ad details page.
function insertNavigationButtons() {
  logMessage("insertNavigationButtons", "INIT", "info");

  // Add a button to click instead of text for ad navigation.
  if ($('#AdNavPrevious').length || $('#AdNavNext').length) {
    var adNavigation;
    adNavigation = $('#AdNavPrevious');
    adNavigation.html('<div id="ArrowPrevPrevious" class="arrow-prev-grey image-nav-next"></div>');
    adNavigation.css('display', 'inline');
    adNavigation = $('#AdNavNext');
    adNavigation.html('<div id="ArrowNextAd" class="arrow-next-grey image-nav-next"></div>');
    adNavigation.css('display', 'inline');
  }
  $('li.back-to-results > a').html('<div id="backToList" class="icon cat-post"></div><span style="margin-left: 10px; font-size: 115%;">Back to Search Results</span>');
  $('div#backToList').css({
    '-webkit-transform' : 'matrix(0.00,1.30,-1.30,0.00,0,0)', // Safari
    '-moz-transform'    : 'matrix(0.00,1.30,-1.30,0.00,0,0)', // Mozilla
    '-ms-transform'     : 'matrix(0.00,1.30,-1.30,0.00,0,0)', // IE 9
    '-o-transform'      : 'matrix(0.00,1.30,-1.30,0.00,0,0)', // Opera
    'transform'         : 'matrix(0.00,1.30,-1.30,0.00,0,0)',
    "display"           : "block",
    "height"            : "25px",
    "width"             : "25px"
  });
  //$('li.back-to-results').css("visibility", "visible");
}

// Insert a [Post To Category] button on the ad listing page.
function insertPostButton() {
  logMessage("insertPostButton", "INIT", "info");

  // Hide the text link until we update it with a button.
  $('h2.icon-link.srp-top > a[data-btn-loc="srp-top"]').css("display", "none");

  // Get the class of the general [Post Ad] button.
  var btnPostAd = $('a[action="PostAdBegin"]');
  var style = getStyleObject(btnPostAd);

  // Update the css of the [Post Ad to Category] button.
  var btnPostToCat = $('a[data-btn-loc="srp-top"]');
  btnPostToCat.css(style);
  btnPostToCat.html("Post to Category");
  btnPostToCat.css({
    "background-color": "#AF28AC", 
    "width": "150px", 
    "padding-left": "0px", 
    "padding-right": "0px",
    "margin-top": "5px",
    "margin-bottom": "5px"
  });
  btnPostToCat.attr("id", "btnPostToCat");
}

// Load the web browser extension settings.
// Calls toggleElements() on chrome.storage.sync complete.
function loadSettings() {
  logMessage("loadSettings", "INIT", "info");

  // Initialize the preferences with some default values.
  chrome.storage.sync.get(settings, function(items) {

    if (typeof(items.enableDebugOutput) !== 'undefined') {
      settings.enableDebugOutput          = (items.enableDebugOutput)         ? items.enableDebugOutput          : settings.enableDebugOutput;
//      logMessage("loadSettings", "settings.enableDebugOutput.value == " + settings.enableDebugOutput.value, "info");
    }
    if (typeof(items.enableKijijiCaptchaSolver) !== 'undefined') {
      settings.enableKijijiCaptchaSolver  = (items.enableKijijiCaptchaSolver) ? items.enableKijijiCaptchaSolver  : settings.enableKijijiCaptchaSolver;
//      logMessage("loadSettings", "settings.enableKijijiCaptchaSolver.value == " + settings.enableKijijiCaptchaSolver.value);
    }
    if (typeof(items.enableKijijiContactPoster) !== 'undefined') {
      settings.enableKijijiContactPoster  = (items.enableKijijiContactPoster) ? items.enableKijijiContactPoster : settings.enableKijijiContactPoster;
//      logMessage("loadSettings", "settings.enableKijijiContactPoster.value == " + settings.enableKijijiContactPoster.value);
    }
    if (typeof(items.enableKijijiImageRotate) !== 'undefined') {
      settings.enableKijijiImageRotate    = (items.enableKijijiImageRotate)   ? items.enableKijijiImageRotate   : settings.enableKijijiImageRotate;
//      logMessage("loadSettings", "settings.enableKijijiImageRotate.value == " + settings.enableKijijiImageRotate.value);
    }
    if (typeof(items.enableKijijiInfinityScroll) !== 'undefined') {
      settings.enableKijijiInfinityScroll  = (items.enableKijijiInfinityScroll) ? items.enableKijijiInfinityScroll : settings.enableKijijiInfinityScroll;
//      logMessage("loadSettings", "settings.enableKijijiInfinityScroll.value == " + settings.enableKijijiInfinityScroll.value);
    }
    if (typeof(items.enableKijijiMapPreview) !== 'undefined') {
      settings.enableKijijiMapPreview     = (items.enableKijijiMapPreview)    ? items.enableKijijiMapPreview    : settings.enableKijijiMapPreview;
//      logMessage("loadSettings", "settings.enableKijijiMapPreview.value == " + settings.enableKijijiMapPreview.value);
    }
    if (typeof(items.filterKijijiAlerts) !== 'undefined') {
      settings.filterKijijiAlerts         = (items.filterKijijiAlerts)        ? items.filterKijijiAlerts        : settings.filterKijijiAlerts;
//      logMessage("loadSettings", "settings.filterKijijiAlerts.value == " + settings.filterKijijiAlerts.value);
    }
    if (typeof(items.filterKijijiFooterLinks) !== 'undefined') {
      settings.filterKijijiFooterLinks    = (items.filterKijijiFooterLinks)   ? items.filterKijijiFooterLinks   : settings.filterKijijiFooterLinks;
//      logMessage("loadSettings", "settings.filterKijijiFooterLinks.value == " + settings.filterKijijiFooterLinks.value);
    }
    if (typeof(items.filterKijijiSocialLinks) !== 'undefined') {
      settings.filterKijijiSocialLinks    = (items.filterKijijiSocialLinks)   ? items.filterKijijiSocialLinks   : settings.filterKijijiSocialLinks;
//      logMessage("loadSettings", "settings.filterKijijiSocialLinks.value == " + settings.filterKijijiSocialLinks.value);
    }
    if (typeof(items.filterKijijiThirdParty) !== 'undefined') {
      settings.filterKijijiThirdParty     = (items.filterKijijiThirdParty)    ? items.filterKijijiThirdParty     : settings.filterKijijiThirdParty;
//      logMessage("loadSettings", "settings.filterKijijiThirdParty.value == " + settings.filterKijijiThirdParty.value);
    }
    if (typeof(items.filterKijijiTopAds) !== 'undefined') {
      settings.filterKijijiTopAds         = (items.filterKijijiTopAds)        ? items.filterKijijiTopAds         : settings.filterKijijiTopAds;
//      logMessage("loadSettings", "settings.filterKijijiTopAds.value == " + settings.filterKijijiTopAds.value);
    }
    if (typeof(items.mapZoomLevel) !== 'undefined') {
      settings.mapZoomLevel               = (items.mapZoomLevel)              ? items.mapZoomLevel               : settings.mapZoomLevel;
//      logMessage("loadSettings", "settings.mapZoomLevel.value == " + settings.mapZoomLevel.value);
    }
    if (typeof(items.userEmail) !== 'undefined') {
      settings.userEmail                  = (items.userEmail)                 ? items.userEmail                   : settings.userEmail;
//      logMessage("loadSettings", "settings.userEmail.value == " + settings.userEmail.value);
    }
    if (typeof(items.userName) !== 'undefined') {
      settings.userName         = (items.userName)                            ? items.userName                    : settings.userName;
//      logMessage("loadSettings", "settings.userName.value == " + settings.userName.value);
    }
    if (typeof(items.userPhone) !== 'undefined') {
      settings.userPhone         = (items.userPhone)                          ? items.userPhone                   : settings.userPhone;
//      logMessage("loadSettings", "settings.userPhone.value == " + settings.userPhone.value);
    }
    if (typeof(items.userCopyMe) !== 'undefined') {
      settings.userCopyMe         = (items.userCopyMe)                        ? items.userCopyMe                  : settings.userCopyMe;
//      logMessage("loadSettings", "settings.userCopyMe.value == " + settings.userCopyMe.value);
    }
    toggleElements();   // Toggle Kijiji elements on / off based on stored user preferences.    
    activateFeatures(); // Active any features the user has enabled.
  });

}

function activateFeatures() {
  if (settings.enableKijijiCaptchaSolver.value == true) {
    insertContactMessages();  // Insert pre-defined messages to poster into the [Contact Poster] form.
  }
  if (settings.enableKijijiCaptchaSolver.value == true) {
    enableKijijiCaptchaSovler();
  }
  if (settings.enableKijijiContactPoster.value == true) {
    enableContactPosterFormFill();
  }
  if (settings.enableKijijiImageRotate.value == true) {
    insertRotationButtons();
  }
  if (settings.enableKijijiInfinityScroll.value == true) {
    enableKijijiInfinityScroll();
  }
  if (settings.enableKijijiMapPreview.value == true) {
    enableKijijiMapPreview();
  }
}

function updateKijijiLook() {
  insertViewOptions();        // Insert the display option to switch between list and map view.
  insertNavigationButtons();  // Insert listing result navigation buttons on the item details page.
  insertPostButton();         // Insert a [Post To Category] button.
}

var init = function() {
  "use strict";


  /* OS Detection {{{*/
  if (navigator.platform.indexOf("Win")!=-1) {
    $('html').addClass('windows')
  }
  
  /*}}}*/

  loadSettings();     // Load the web browser extension settings and toggle elements on or off.
  updateKijijiLook()  // Change the way that Kijiji looks.

  // Hack for Kijiji Auto to hide description after clicking the [CarProof] tab.
  $( document ).ready(function() {
      $("#Tab1").css("display", "block");
      $("#Tab1").removeClass("show");
  });
}

setTimeout(function () {
  init()
}, 1);
