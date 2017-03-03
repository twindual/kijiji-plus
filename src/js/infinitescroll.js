/*!
 * Kijiji+ Site Enhancer v1.0.0 (https://github.com/twindual/kijiji-plus)
 * Copyright 2017 André Fortin.
 * Licensed under the GNU GPL (http://www.gnu.org/licenses/)
 */

// Get the pagination element as HTML from the next page results to help trigger last page event.
function getPagination (ajaxResponse = '') {
    logMessage('getPagination', 'INIT', 'info');

    var pagination = '';
    if (typeof(ajaxResponse) === 'string') {
      
      // Get the pagination element.
      var tagOpen = '<div class="pagination"';
      var posStart = ajaxResponse.indexOf(tagOpen);
      if (posStart >= 0) {
          var tagClose = '</div>';
          var posEnd = ajaxResponse.indexOf(tagClose, posStart + tagOpen.length);
          if (posEnd >= 0) {
              pagination = ajaxResponse.substr(posStart, posEnd - posStart + tagOpen.length);
              $('div.pagination').html(pagination);
          }
      }
    } else {
      logMessage('getPagination', 'typeof(ajaxResponse) !== string', 'warn');
    }

    return pagination;
};

// Is this the last page of results?
function isLastPage(pagination = '') {
    logMessage('isLastPage', 'INIT', 'info');

    var isLastPage = false;
    var tagOpen = '<a title="Next"';
    var posStart = pagination.indexOf(tagOpen);
    if (posStart == -1) {
        // Its not here so we are pretty sure this is actually the last page.
        isLastPage = true;
        logMessage('isLastPage == ' + isLastPage, 'INIT', 'info');
    }

    return isLastPage;
};

// Remove any ads from the next page results that already appear in the displayed ad listing.
function removeDuplicates(children) {
    logMessage('removeDuplicates', 'INIT', 'info');

    // Get a list of all the unique Ads we are currently displaying.
    var loadedAds = Array();
    var adCountHide = 0;
    var adCountShow = 0;
    var lastAdCount = 0;
    $('div [data-ad-id]').each(function () {
        var adId = $(this).attr('data-ad-id');
        //logMessage("removeDuplicates', 'SEARCHING for adId == " + adId, 'info');

        // Is this ad already displayed?
        if (loadedAds.indexOf(adId) !== -1) {
            // Yes, we have shown this before, so hide it.
            adCountHide++;
            //logMessage("removeDuplicates', 'REMOVING duplicate adId == " + adId, 'info');
            $(this).remove();
        } else {
            // No, its new so show it.
            adCountShow++;
            loadedAds.push(adId);
        }
    });
    logMessage('removeDuplicates', 'AD STATS : Total (' + loadedAds.length + ') - Show ' + adCountShow + ') - Hide (' + adCountHide + ')', 'info');
    var adCountHide = 0;
    var adCountShow = 0;
    var adCount = 0;
    // Remove any ads from the fetched results that are already being displayed.
    $(children).each(function () {
        adCount++;
        var adId = $(this).attr('data-ad-id');
        //logMessage("removeDuplicates', 'SEARCHING for adId == " + adId, 'info');

        // Is this ad already displayed?
        if (loadedAds.indexOf(adId) !== -1) {
            // Yes, we have shown this before, so hide it.
            adCountHide++;
            //logMessage("removeDuplicates', 'REMOVING duplicate adId == " + adId, 'info');
            $(this).remove();
        } else {
            // No, its new so show it.
            adCountShow++;
            if (lastAdCount == 0) {
                lastAdCount = loadedAds.length;
            }
            loadedAds.push(adId);
        }
        logMessage('removeDuplicates', 'AD STATS : Total (' + loadedAds.length + ') - Show ' + adCountShow + ') - Hide (' + adCountHide + ')', 'info');
    });

    var results = {data: children, items: adCount, duplicates: adCountHide};
    return results;
};

// Infinity-scrolling of Ad listings.
function enableKijijiInfinityScroll() {
    logMessage('enableKijijiInfinityScroll', 'INIT', 'info');

  // ToDo: Fix Language Detection.
  /* Lang Detection & Config {{{*/
  //currentLang = $('meta[name="DCSext.locale"]').attr('content')
  //loadingText = currentLang == 'en_CA' ? 'Loading next ads…' : 'Chargement des annonces suivantes…'

  var completeMsg = '<em>Congratulations, you\'ve reached the end of the internet.</em>';
  var loadingMsg  = '<div id="infscr-loadingMsg" style="width: 100%; position: relative; top: 50%; transform: translateY(-50%); font-size: 200%; text-align: center; vertical-align: middle;"><em>Loading the next set of ads...</em></div>';
  var loadingImg  = chrome.extension.getURL('img/ajax-spinner.gif');

/* Page: Ads listing (browsing, my favorite, all user ads) {{{*/

  // if ($('#sbResultsListing').length || $('.adsTable').length || $('#tableDefault').length) {
  if ($('.container-results').length) {

    // InfiniteScroll
    $('.container-results').infinitescroll(
      {
        debug:        true,
        bufferPx:     1600,
        navSelector:  'div.pagination',
        nextSelector: 'div a[title="Next"]',
        itemSelector: 'div [data-ad-id]', // All ad items have the [data-ad-id] attribute.
        loading: {
          completeMsg:  '',
          loadingMsg:   loadingMsg,
          img:          loadingImg
        },
        pathParse:      // Parse the SRP number from the [Next Page] link in the Navigation selector.
          function (path) {
            if (path.match(/^(.*page\-).*(\/.*$)/)) {
                return path.match(/^(.*page\-).*(\/.*$)/).slice(1);
            }
          },
        maxPage:      100,
        dataType:     'html',
        callbacks: {
          onFetch: onFetch,
          onComplete: onComplete
        }
      }
    );
  }
}

// Triggers AFTER data returns via AJAX request.
function onFetch(params = {}) {
  logMessage('onFetch', 'INIT', 'info');

  var pagination = getPagination(params.response);
  logMessage('onFetch', 'pagination == ' + pagination, 'info');

  var isDone = isLastPage(pagination);
  logMessage('onFetch', 'isDone == ' + isDone, 'info');

  var data = $(params.response).find(params.options.itemSelector);
  var response = removeDuplicates(data);
  if ((response.duplicates >= response.items) && (isDone === true)) {
    // No more Kijiji results left.
    params.options.state.isDone = true;
    data = ''; 
  } else {
    data = response.data;
  }
  
  return {data: data, options: params.options};
}

// Triggers AFTER fetching the final page of results, and appending the data to existing results list, AND scrolling window to start of new items.
//function onComplete(infscr, newResults, url) {
function onComplete(status) {
  logMessage('onComplete', 'INIT', 'info');
  
  var completeMsg = '<span>You\'ve reached the end of the listings.</span>';
  if (status == 'done') {
      logMessage('onComplete', 'status ==' + status, 'info');
      $('div.container-results').append($('div.bottom-bar'));

      $('div.pagination').html(completeMsg);
      logMessage('onComplete', 'Show Pagination element', 'info');
      $('div.pagination').css('display', 'block').show();      
  }
}
