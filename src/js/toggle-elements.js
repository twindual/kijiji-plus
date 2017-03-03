/*!
 * Kijiji+ Site Enhancer v1.0.0 (https://github.com/twindual/kijiji-plus)
 * Copyright 2017 André Fortin.
 * Licensed under the GNU GPL (http://www.gnu.org/licenses/)
 */

// Remove undesired annoyance elements from Kijiji.
function removeElementsKijiji(optionList = ['all']) {
  logMessage("removeElementsKijiji", "INIT", "info");

  var allOptions = [
    'kijiji-alerts',
    'kijiji-adsense', 
    'kijiji-banner', 
    'kijiji-ebay', 
    'kijiji-footer', 
    'kijiji-homepage', 
    'kijiji-inline', 
    'kijiji-social', 
    'kijiji-skyscraper', 
    'kijiji-sponsored', 
    'kijiji-thirdparty', 
    'kijiji-top'
  ];

  var defaultOptions = [
    'kijiji-adsense',
    'kijiji-banner',
    'kijiji-ebay',
    'kijiji-homepage',
    'kijiji-inline',
    'kijiji-skyscraper',
    'kijiji-sponsored'
  ];

  // Sanity check the input.
  if (!Array.isArray(optionList)) {
    // Error, you're doing it wrong!
//    logMessage("removeElementsKijiji", "Sanity check FAILURE on [optionList]", "warn");
    optionList = defaultOptions;
  } else {
//    logMessage("removeElementsKijiji", "Sanity check SUCCESS on [optionList]", "info");
  }

  // Check if we want to remove all the annoyances.
  if (optionList.indexOf('all') > -1) {
//    logMessage("removeElementsKijiji", "ALL options selected", "info");
    optionList = allOptions;
  }

  // Get the next annoyance to remove.
  var optionList = arrayUnique(optionList.concat(defaultOptions));
//  logMessage("removeElementsKijiji", "optionList count == [" + optionList.length + "]", "info");
  
  for(index in optionList) {
//    logMessage("removeElementsKijiji", "option == [" + optionList[index] + "]", "info");
    switch (optionList[index]) {

      case 'kijiji-adsense':
        // Remove Adsense.
        $('.adsense-top-bar').remove();
        $('.adsense-container').remove();
        break;

      case 'kijiji-alerts':
        /* Hide SRP extra bar with Kijiji Alerts registration button */
        $('div.extra-bar').css("display", "none");
        break;
        
      case 'kijiji-banner':
        // Remove banner headers on pages.
        $('.leaderboard').remove();
        $('.banner').remove();
        $('#R2SLeaderboard').remove();
        break;

      case 'kijiji-ebay':
        // Remove eBay ads.
        $('div [data-fes-id="Treebay1"]').remove();
        $('div [data-fes-id="Treebay2"]').remove();
        $('div [data-fes-id="Treebay3"]').remove();
        break;
        
      case 'kijiji-footer':
        /* Show global page footer links and badges */
        $('#FooterLinkColumns').css("display", "none");
        $('#FooterBadgeColumns').css("display", "none");
        break;

      case 'kijiji-homepage':
        // Remove random useless ads on home.
        $('div [data-fes-id="HPGallery"]').remove();
        $('div [data-fes-id="recommendations"]').remove();
        $('.top-links').remove();
        break;

      case 'kijiji-inline':
        // Remove in-line banner ads.
        $('#InlineBanner').remove();
        break;

      case 'kijiji-skyscraper':
        // Remove left column ads.
        $('.skyscraper').remove();
        break;

      case 'kijiji-social':
        // Remove the social sharing bar.
        $('#ShareLinkBar').css("display", "none");
        break;

      case 'kijiji-sponsored':
        // Remove sponsors and sponsored ads.
        $('#ImageSponsors').remove();
        $('.sponsored-ad-container').remove();
        break;

      case 'kijiji-thirdparty':
        // Remove 3rd party ads.
        $('.third-party').css("display", "none");
        break;

      case 'kijiji-top':
        // Remove top ads.
        $('.top-ads-top-bar').css("display", "none");
        $('.top-feature').css("display", "none");
        $('.top-ads-bottom-bar').css("display", "none");
        break;

      default:
        // Error unknown annoyance.
        logMessage("removeElementsKijiji", "UNKNWON option == [" + optionList[index] + " ]", "warn");
    }
  }
}

// Show desired annoyance elements from Kijiji.
function showElementsKijiji(optionList = ['all']) {
  logMessage("showElementsKijiji", "INIT", "info");

  var allOptions = [
    'kijiji-alerts',      // tested - ok
    'kijiji-footer',      // tested - ok
    'kijiji-social',      // tested - ok
    'kijiji-thirdparty',  // tested - ok
    'kijiji-top',         // tested - ok
  ];
  
  // Sanity check the input.
  if (!Array.isArray(optionList)) {
    // Error, you're doing it wrong!
//    logMessage("showElementsKijiji", "Sanity check FAILURE on [optionList]", "warn");
  } else {
//    logMessage("showElementsKijiji", "Sanity check SUCCESS on [optionList]", "info");

    // Check if we want to show all the annoyances.
    if (optionList.indexOf('all') > -1) {
//      logMessage("showElementsKijiji", "ALL options selected", "info");
      optionList = allOptions;
    } else {
//      logMessage("showElementsKijiji", "optionList count == [" + optionList.length + "]", "info");
    }

    if (optionList.length > 0) {
      // Get the next annoyance to show.
      for(index = 0; index < optionList.length; index++) {
//        logMessage("showElementsKijiji", "option == [" + optionList[index] + "]", "info");
        switch (optionList[index]) {
          
          case 'kijiji-alerts':
            /* Show SRP extra bar with Kijiji Alerts registration button */
            $('div.extra-bar').each(function(index) {
              $( this ).css("display", "block !important");
            });
            break;
            
          case 'kijiji-footer':
            /* Show global page footer links and badges */
            $('#FooterLinkColumns').css("display", "block");
            $('#FooterBadgeColumns').css("display", "block");
            break;

          case 'kijiji-social':
            // Show the social sharing bar.
            $('#ShareLinkBar').css("visibility", "visible");
            break;

          case 'kijiji-thirdparty':
            // Show 3rd party ads.
            $('.third-party').each(function(index) {
              $( this ).css("display", "block");
            });
            break;

          case 'kijiji-top':
            // Show top ads.
            $('div.top-ads-top-bar').each(function(index) {
              $( this ).css("display", "block");
            });
            $('.top-feature').each(function(index) {
              $( this ).css("visibility", "visible");
              $( this ).css("display", "block");
            });
            $('.top-ads-bottom-bar').each(function(index) {
              $( this ).css("display", "block");
            });
            break;

          default:
            // Error unknown annoyance.
            logMessage("showElementsKijiji", "UNKNWON option == [" + optionList[index] + " ]", "warn");
        }
      }
    } else {
//      logMessage("showElementsKijiji", "optionList is EMPTY", "info");
    }
  }
  
  $('div.regular-ad').css('display', 'block');
}

// Toggle the display of annoyance elements from Kijiji.
function toggleElements() {
  logMessage("toggleElements", "INIT", "info");

  var desirables = [];
  var undesirables = [];

  logMessage("toggleElements", "settings.filterKijijiAlerts.value == " + settings.filterKijijiAlerts.value, "info");
  if (settings.filterKijijiAlerts.value === true) {
    undesirables.push('kijiji-alerts');
  } else {
    desirables.push('kijiji-alerts');
  }

  logMessage("toggleElements", "settings.filterKijijiFooterLinks.value == " + settings.filterKijijiFooterLinks.value, "info");
  if (settings.filterKijijiFooterLinks.value === true) {
    undesirables.push('kijiji-footer');
  } else {
    desirables.push('kijiji-footer');
  }

  logMessage("toggleElements", "settings.filterKijijiSocialLinks.value == " + settings.filterKijijiSocialLinks.value, "info");
  if (settings.filterKijijiSocialLinks.value === true) {
    undesirables.push('kijiji-social');
  } else {
    desirables.push('kijiji-social');
  }

  logMessage("toggleElements", "settings.filterKijijiThirdParty.value == " + settings.filterKijijiThirdParty.value, "info");
  if (settings.filterKijijiThirdParty.value === true) {
    undesirables.push('kijiji-thirdparty');
  } else {
    desirables.push('kijiji-thirdparty');
  }

  logMessage("toggleElements", "settings.filterKijijiTopAds.value == " + settings.filterKijijiTopAds.value, "info");
  if (settings.filterKijijiTopAds.value === true) {
    undesirables.push('kijiji-top');
  } else {
    desirables.push('kijiji-top');
  }

  // Remove first, then allow after.
  removeElementsKijiji(undesirables);
  showElementsKijiji(desirables);
}

