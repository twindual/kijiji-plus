/*!
 * Kijiji+ Site Enhancer v1.0.0 (https://github.com/twindual/kijiji-plus)
 * Copyright 2017 André Fortin.
 * Licensed under the GNU GPL (http://www.gnu.org/licenses/)
 */

"use strict";

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

// Save user preferences to chrome.storage
function saveForm(e) {
  clearTimeout(window.delayer);
  window.delayer = setTimeout(function () {
    var item = {};
    var value = e.target.value;
    if (e.target.type === 'checkbox' || e.target.type === 'radio') {
      value = e.target.checked;
    }
    item[e.target.id] = {
      value: value,
      type: e.target.type
    };
    chrome.storage.sync.set(item, function() {
      // Update status to let user know options were saved.
      var status = $('#status');
      status.text('Options saved.');
      setTimeout(function() {
        status.text('');
      }, 750);
    });
  }, 500);
}

// Restore user preferences from chrome.storage.
function restoreForm() {
    // Initialize the preferences with some default values.
  chrome.storage.sync.get(settings, function(items) {
    for(var value in items) {
      // There are only 0b10 types of values. "checkbox" and "everything else".
      if (items[value].type === 'checkbox') {
        $('#' + value).prop('checked', items[value].value);
      } else {
        $('#' + value).val(items[value].value);
      }
    }
  });
}


// Restore the form state after the web page finishes loading.
$(document).ready(function() {

  // Event handler for clicking a menu link.
  $('.menu a').on('click', function(ev) {
    ev.preventDefault();
    var selected = 'selected';

    $('.mainview > *').removeClass(selected);
    $('.menu li').removeClass(selected);
    setTimeout(function() {
      $('.mainview > *:not(.selected)').css('display', 'none');
    }, 100);

    $(ev.currentTarget).parent().addClass(selected);
    var currentView = $($(ev.currentTarget).attr('href'));
    currentView.css('display', 'block');
    setTimeout(function() {
      currentView.addClass(selected);
    }, 0);

    setTimeout(function() {
      $('body')[0].scrollTop = 0;
    }, 200);
  });

  // Event handler for opening a modal window.
  $('#launch_modal').on('click', function(ev) {
    
    ev.preventDefault();    
    var modal = $('.overlay').clone();  // Instantiate a new modal window.
    modal = $(modal);                   // Save a reference to it so we don't have to keep looking it up each time.
    modal.attr('style','');             // Restyle the modal window.
    
    // Event handler for closing the modal.
    modal.find('button, .close-button').on('click', function() {
      modal.addClass('transparent');
      setTimeout(function() {
        modal.remove();
      }, 1000);
    });

    // Event handler for handling the display of the "I'm Busy Doing Something" state.
    modal.on('click', function() {
      modal.find('.page').addClass('pulse');
      modal.find('.page').on('webkitAnimationEnd', function() {
        $(this).removeClass('pulse');
      });
    });

    // 
    modal.find('.page').on('click', function(ev) {
      ev.stopPropagation();
    });
    
    // Now attach this modal window to the webpage so we can display it.
    $('body').append(modal);
  });

  $('.mainview > *:not(.selected)').css('display', 'none');

  // Event handlers for saving state of form controls: checkbox, everything else.
  $('input[type=checkbox], input[type=radio]').on('click', saveForm);
  $('input[type=text], input[type=number], input[type=search], select').on('input', saveForm);

  restoreForm(); // Restore user preferences from chrome.storage.
});
