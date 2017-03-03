/*!
 * Kijiji+ Site Enhancer v1.0.0 (https://github.com/twindual/kijiji-plus)
 * Copyright 2017 André Fortin.
 * Licensed under the GNU GPL (http://www.gnu.org/licenses/)
 */

var myMessages = [
  {
    id: 'kjIsAvailable', 
    label: "Is it still available?",
    text: "Hi, I'm interested. Please contact me if this is still available."
  }, {
    id: 'kjMeetUp', 
    label: "When can we meet?", 
    text: "Hi, I'm interested. When are you free to meet?"
  }, {
    id: 'kjHowMuch', 
    label: "How much?", 
    text: "Hi, I'm interested. How much do you want for this item?"
  }
];

// Trigger event  to fill the [Contact Poster] message field when the user clicks a message.
function attachEventClickPosterMessage(messageId) {
  $(document).on('click', '#' + messageId, function(){fillContactMessage(messageId);});
}

// Fill an individual form field on the [Contact Poster] form.
function fillContactField(fieldSelector, fieldValue) {
  // http://stackoverflow.com/questions/7427163/trigger-keypresskeydown-with-jquery  
  var field = $(fieldSelector)
    field.focus();
    // Activate form data validation if there is a value.
    if (fieldValue.length) {
      var e = jQuery.Event("keydown");
      //e.keyCode = 50;                     
      field.trigger(e);
    }
    field.val(fieldValue);
    field.text(fieldValue);
}

// Fill the [Contact Poster] form field with the correct user-selected message.
function fillContactMessage(messageId) {
  var fieldSelector = '#viewad-contact-message';
  var fieldValue = '';

  logMessage("fillContactMessage", "messageId == " + messageId, "info");

  for (message in myMessages) {
    if (myMessages[message].id == messageId) {
      fieldValue = myMessages[message].text;
      break;
    }
  }

  logMessage("fillContactMessage", "message == " + fieldValue, "info");

  fillContactField(fieldSelector, fieldValue);
}

// Form-Fill the [Contact Poster] form with the users contact info.
function enableContactPosterFormFill() {
  logMessage("enableContactPosterFormFill", "settings.enableKijijiContactPoster.value == " + settings.enableKijijiContactPoster.value, "info");

  // Unable email field, it gets disabled when we are logged in.
  $('#viewad-contact-from').prop("disabled", false);

  var fieldSelector, fieldValue;

  // Fill other form fields.
  fieldSelector = '#viewad-contact-from';
  fieldValue = settings.userEmail.value;
  logMessage("enableContactPosterFormFill", "fieldValue == " + fieldValue, "info");
  fillContactField(fieldSelector, fieldValue);

  fieldSelector = '#viewad-contact-from-name';
  fieldValue = settings.userName.value;
  logMessage("enableContactPosterFormFill", "fieldValue == " + fieldValue, "info");
  fillContactField(fieldSelector, fieldValue);

  fieldSelector = '#viewad-contact-phone-number';
  fieldValue = settings.userPhone.value;
  logMessage("enableContactPosterFormFill", "fieldValue == " + fieldValue, "info");
  fillContactField(fieldSelector, fieldValue);

  $('#viewad-contact-sendcopy').prop('checked', settings.userCopyMe.value);
}

// Insert [Choose a Message] messages to [Contact Poster] form.
function insertContactMessages() {
  logMessage("insertMessaging", "INIT", "info");

  // Updates for the contact poster form.
  var isFound = false;
  var formSelector = 'form#R2SForm';
  var formContactPoster = $(formSelector);
  if (formContactPoster.length) {
    isFound = true;
  } else {
    formSelector = '#CasReplyForm';
    formContactPoster = $(formSelector);
    if (formContactPoster.length) {
      isFound = true;
    }
  }
  
  if (isFound) {
    // Add a dropdown for canned replies to posters.
    var htmlDropDown = 
      '<div class="dropdown" style="width: 100%;">' +
      '  <button class="btn btn-primary dropdown-toggle" style="width: 100%;" type="button" data-toggle="dropdown">Choose a Message' +
      '  <span class="caret"></span></button>' +
      '  <ul id="posterMessageList" class="dropdown-menu">' +
      '  </ul>' +
      '</div>';
    $(formSelector).before(htmlDropDown);

    var listItems = '';
    for (index = 0; index < myMessages.length; index++) {
      listItems = listItems + '<li style="padding-left: 5px;" id="' + myMessages[index].id + '">' + myMessages[index].label + '</li>';
      if (index < myMessages.length - 1) {
        listItems = listItems + '<li class="divider"></li>';
      }
    }
    $('ul#posterMessageList').append(listItems);

    // Add click handle to poster message replies.    
    for (index in myMessages) {
      attachEventClickPosterMessage(myMessages[index].id);
    }
  } else {
    // Do nothing since we didn't find a Reply To Sender form.
  }
}
