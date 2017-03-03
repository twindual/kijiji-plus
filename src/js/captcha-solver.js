/*!
 * Kijiji+ Site Enhancer v1.0.0 (https://github.com/twindual/kijiji-plus)
 * Copyright 2017 André Fortin.
 * Licensed under the GNU GPL (http://www.gnu.org/licenses/)
 */
// Kijiji Captcha Solver.
var ctx;
var color = document.getElementById('color');


// Converts canvas to an image
function convertCanvasDataToImage(imgData, id) {
    var canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.width = 14;
    canvas.height = 20;
    var ctx = canvas.getContext('2d');
    ctx.putImageData(imgData, 0, 0);

    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

// Converts image to canvas; returns new canvas element
function convertImageToCanvas(image, id) {
  var canvas = document.createElement("canvas");
  canvas.id = id;
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext("2d").drawImage(image, 0, 0);

  return canvas;
}

function enableKijijiCaptchaSovler() {
    logMessage("enableKijijiCaptchaSovler", "INIT", "info");

    // Find the "Reply to Sender" contact poster form.
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
        parseCaptcha();
    } else {
    // Do nothing since we didn't find a Reply To Sender form.
    }
}

// Find the slope of the text direction so we know where to look for the captcha digits.
function findTextSlope(imageCheck) {

  var slope = true; // true == slope up, false == slope down
  var widthCheck  = imageCheck.width;
  var heightCheck = imageCheck.height;
  
  // Running total of non-white pixels. The one with the most determines the text slope direction.
  var countTop = 0;
  var countBottom = 0;

  // Check the top of the image for non-white pixels.
  for (indexCheckX = 0; indexCheckX < widthCheck; indexCheckX++) {
    for (indexCheckY = 0; indexCheckY < 3; indexCheckY++) {

      //var compCheckRed   = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 0];
      var compCheckGreen = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 1];
      //var compCheckBlue  = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 2];

      if (compCheckGreen == 0) {
        countTop++;
      }
    }
  }

  // Check the bottom of the image for non-white pixels.
  for (indexCheckX = 0; indexCheckX < widthCheck; indexCheckX++) {
    for (indexCheckY = heightCheck -1; indexCheckY >= heightCheck - 3; indexCheckY--) {

      //var compCheckRed   = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 0];
      var compCheckGreen = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 1];
      //var compCheckBlue  = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 2];

      if (compCheckGreen == 0) {
        countBottom++;
      }
    }
  }

  if (countTop > countBottom) {
    slope = false;
  } else {
    slope = true;
  }

  return slope;  
}

// Normalize the brightest and darkest pixels.
function filtergreylevelCanvas(imageCheck, minLevel, maxLevel, colorReplace) {

  var widthCheck  = imageCheck.width;
  var heightCheck = imageCheck.height;

  for (indexCheckX = 0; indexCheckX < widthCheck; indexCheckX++) {
    for (indexCheckY = 0; indexCheckY < heightCheck; indexCheckY++) {

      var compCheckRed   = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 0];
      //var compCheckGreen = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 1];
      //var compCheckBlue  = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 2];

      // Its in the range to filter,
      if (compCheckRed >= minLevel && compCheckRed <= maxLevel) {
        imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 0] = 255;
        imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 1] = 255;
        imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 2] = 255;
      }
    }
  }

  return imageCheck;
}

// Filter out all other pixels in the image within a specific range of an existing pixel's value.
function fuzzifyCanvas(imageCheck, imageDigits, range = 10) {

  var widthCheck  = imageCheck.width;
  var heightCheck = imageCheck.height;

  var widthDigits  = imageDigits.width;
  var heightDigits = imageDigits.height;

  for (indexCheckX = 0; indexCheckX < widthCheck; indexCheckX++) {
    for (indexCheckY = 0; indexCheckY < heightCheck; indexCheckY++) {

      var compCheckRed   = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 0];
      var compCheckGreen = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 1];
      var compCheckBlue  = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 2];
      
      var redMin   = compCheckRed   - range;
      var redMax   = compCheckRed   + range;
      var greenMin = compCheckGreen - range;
      var greenMax = compCheckGreen + range;
      var blueMin  = compCheckGreen - range;
      var blueMax  = compCheckGreen + range;

      // Check every pixel in the sub-image for a match.
      for (indexDigitsX = 0; indexDigitsX < widthDigits; indexDigitsX++) {
        for (indexDigitsY = 0; indexDigitsY < heightDigits; indexDigitsY++) {
          
          var compRed   = imageDigits.data[((indexDigitsY * widthDigits * 4) + indexDigitsX * 4) + 0];
          var compGreen = imageDigits.data[((indexDigitsY * widthDigits * 4) + indexDigitsX * 4) + 1];
          var compBlue  = imageDigits.data[((indexDigitsY * widthDigits * 4) + indexDigitsX * 4) + 2];

          // IF the pixel is not RGB(0, 252, 0) AND it matches our checkpixel RGB components THEN reset the pixel to RGB(filter-color);
          if ((compRed == 0   && compGreen == 255 && compBlue == 0)) {
            // Do nothing since it the filter color.
          } else {

            // Reset pixel to filter RGB values if it matches the check pixel RGB values.
            if (
                (compRed   >= redMin   && compRed   <= redMax) &&
                (compGreen >= greenMin && compGreen <= greenMax) &&
                (compBlue  >= blueMin  && compBlue  <= blueMax))
            {
                imageDigits.data[((indexDigitsY * widthDigits * 4) + indexDigitsX * 4) + 0] = 0;
                imageDigits.data[((indexDigitsY * widthDigits * 4) + indexDigitsX * 4) + 1] = 255;
                imageDigits.data[((indexDigitsY * widthDigits * 4) + indexDigitsX * 4) + 2] = 0;
                imageDigits.data[((indexDigitsY * widthDigits * 4) + indexDigitsX * 4) + 3] = 255;
            }
          }
        }
      }
    }
  }

  return imageDigits;
}

// Create a greyscale canvas image.
function greyscaleCanvas(imageCheck) {

  var widthCheck  = imageCheck.width;
  var heightCheck = imageCheck.height;

  for (indexCheckX = 0; indexCheckX < widthCheck; indexCheckX++) {
    for (indexCheckY = 0; indexCheckY < heightCheck; indexCheckY++) {

      var compCheckRed   = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 0];
      var compCheckGreen = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 1];
      var compCheckBlue  = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 2];

      var greyPixel = (compCheckRed + compCheckGreen + compCheckBlue) / 3;

      imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 0] = greyPixel;
      imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 1] = greyPixel;
      imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 2] = greyPixel;
    }
  }

  return imageCheck;
}

function parseCaptcha() {
    logMessage("parseCaptcha", "INIT", "info");

    // Construct the image to hold the captcha digits to verify against.
    var newHtml = '<div id="canvasHolder" style="display: none;"></div>';
    $('#UserContent').append(newHtml);

    // http://stackoverflow.com/questions/15605522/how-to-wait-until-image-is-loaded-in-jquery
    // http://stackoverflow.com/questions/26747353/console-log-uncaught-securityerror-failed-to-execute-getimagedata-on-canvas
    //  Construct an image to hold the captcha digits to verify against.
    var newImage = $('<img id="digits" style="display: none; width: 140; height: 40px;" crossOrigin="anonymous" />');
    newImage.appendTo('#canvasHolder');

    // Get the image.
    var imageCaptcha = document.getElementById("bbImage");
    var canvasCaptcha = convertImageToCanvas(imageCaptcha, 'canvasCaptcha');
    $('#canvasHolder').append(canvasCaptcha).each(function() {
        var imageDigits  = document.getElementById("digits");

        // Register image's load event BEFORE assigning an image source.
        $(imageDigits).on('load', function(){
            var canvasDigits = convertImageToCanvas(document.getElementById("digits"), 'canvasDigits');
            logMessage("parseCaptcha", "imageDigits -> onLoad()", "info");

            // This function is invoked in the future, when the image load event has been fired
            solveCaptcha(canvasCaptcha, canvasDigits);
        });

        imageDigits.src = chrome.extension.getURL("img/digits.png");
    });    
}

// Compare a digit in the captcha image to a known digit in the solution image.
function compareDigit(imageCaptcha, imageCheck) {
    // Get a count of all the non-white pixels.
    var matchThreshold      = 80;
    var countPixelsCheck    = 0;
    var countPixelsCaptcha  = 0;
    var countPixelsMatch    = 0;
    var percentCaptchaMatch = 0;
    var percentPixelsMatch  = 0;
    var isMatch             = false;
    var uncertainty         = false;
    var widthCheck  = imageCheck.width;
    var heightCheck = imageCheck.height;

    for (indexCheckX = 0; indexCheckX < widthCheck; indexCheckX++) {
        for (indexCheckY = 0; indexCheckY < heightCheck; indexCheckY++) {
            var compCheck   = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 1];
            var compCaptcha = imageCaptcha.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 1];

            // Count our non-white pixels.
            if (compCheck == 0) {
                countPixelsCheck = countPixelsCheck + 1;
            }
            if (compCaptcha == 0) {
                countPixelsCaptcha = countPixelsCaptcha + 1
            }
            if (compCheck == 0 && compCaptcha == 0) {
                countPixelsMatch = countPixelsMatch + 1;
            }
        }
    }

    // How close of a match is it?
    percentCaptchaMatch = (countPixelsMatch / countPixelsCaptcha) * 100;
    if (countPixelsMatch > countPixelsCheck) {
        // There is noise in the picture so we have some uncertainty.
        uncertainty = true;
        percentPixelsMatch = 100;
    } else {
        uncertainty = false;
        percentPixelsMatch = (countPixelsMatch / countPixelsCheck) * 100;
    }

    if (percentCaptchaMatch >= matchThreshold) {
        isMatch = true; // We are pretty sure we found it.
    } else {
        isMatch = false;
    }

    return {
        isMatch: isMatch,
        uncertainty: uncertainty,
        percentCaptchaMatch: percentCaptchaMatch,
        percentPixelsMatch: percentPixelsMatch,
        countPixelsCheck: countPixelsCheck,
        countPixelsCaptcha: countPixelsCaptcha,
        countPixelsMatch: countPixelsMatch};
}

// Turn the canvas image into a monochrome canvas image.
function twocolorCanvas(imageCheck, colorLevel, colorLight, colorDark, colorBackground) {

  var widthCheck  = imageCheck.width;
  var heightCheck = imageCheck.height;

  for (indexCheckX = 0; indexCheckX < widthCheck; indexCheckX++) {
    for (indexCheckY = 0; indexCheckY < heightCheck; indexCheckY++) {
      //var compCheckRed   = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 0];
      var compCheckGreen = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 1];
      //var compCheckBlue  = imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 2];

      // Its in the range to filter for light color,
      if (compCheckGreen == colorBackground || compCheckGreen >= colorLevel) {
        imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 0] = colorLight;
        imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 1] = colorLight;
        imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 2] = colorLight;
      } else {
        imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 0] = colorDark;
        imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 1] = colorDark;
        imageCheck.data[((indexCheckY * widthCheck * 4) + indexCheckX * 4) + 2] = colorDark;
      }
    }
  }

  return imageCheck;
}

// Solve the captcha.
function solveCaptcha(canvasCaptcha, canvasDigits) {
    
    // Remove color from the image.
    //var canvasCaptcha = $('#canvasCaptcha');
    var ctd = canvasDigits.getContext('2d');

    //var testing = ctd.getImageData(0, 0, 14, 20);
    //document.getElementById("canvasHolder").appendChild(convertCanvasDataToImage(testing, 'booboo'));


    var ctx = canvasCaptcha.getContext('2d');
    var height = canvasCaptcha.height;
    var width  = canvasCaptcha.width;
    var imageCheck;

    // Make it GreyScale.
    imageCheck = greyscaleCanvas(ctx.getImageData(0, 0, width, height));
    ctx.putImageData(imageCheck, 0, 0);

    // Remove any pixels above 222 in brightness.
    var minLevel = 125; // Previous level 125.
    var maxLevel = 255;
    var colorReplace = 255
    imageGrey = filtergreylevelCanvas(imageCheck, minLevel, maxLevel, colorReplace);
    ctx.putImageData(imageCheck, 0, 0);

    // Remove any color found in the check image from the digits image within +/= value range of each RGB component.
    var range = 3;
    var imageDigits = ctx.getImageData(8, 12, 67, 28);

    imageCheck = ctx.getImageData(0, 0, width, 12);
    imageDigits = fuzzifyCanvas(imageCheck, imageDigits, range);

    imageCheck = ctx.getImageData(0, height-12, width, 12); 
    imageDigits = fuzzifyCanvas(imageCheck, imageDigits, range);

    imageCheck = ctx.getImageData(0, 12, 12, height - (12 * 2)); 
    imageDigits = fuzzifyCanvas(imageCheck, imageDigits, range);
    ctx.putImageData(imageDigits, 8, 12);

    // 2 Color canvas.
    var colorLevel = minLevel;
    var colorLight = 255;
    var colorDark  = 0;
    var colorBackground = 0;
    imageCheck = twocolorCanvas(ctx.getImageData(0, 0, width, height), colorLevel, colorLight, colorDark, colorBackground);
    ctx.putImageData(imageCheck, 0, 0);

    // Is the text sloping up or down?
    var imageSlope = ctx.getImageData(11, 14, 14, 23);// Get a slice at (11, 14), w: 14, h: 23.
    var textSlopeDirection = findTextSlope(imageSlope);
    var imageTag = 'u';
    if (textSlopeDirection == true) {
        imageTag = '-u';
        $('#captchaDirection').text('Text Slope Direction == UP');
    } else {
        imageTag = '-d';
        $('#captchaDirection').text('Text Slope Direction == DOWN');
    }
    
    var captchaDigitUknown = '?';
    var captchaDigitSeparator = '-';
    var captchaDigitsToFind = 4;
    var captchaValues          = [captchaDigitUknown, captchaDigitUknown, captchaDigitUknown, captchaDigitUknown];
    var captchaMatchPercentage = [0, 0, 0, 0];
    var captchaDigitPercentage = [0, 0, 0, 0];
    var matchThreshold = 80;

    var canvasTestDigit;
    var canvasCaptchaDigit;
    var digitWidth  = 14;
    var digitHeight = 20;
    
    var allDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var coordsUp = [
        {x: 12, y: 17},
        {x: 29, y: 16},
        {x: 46, y: 15},
        {x: 62, y: 14}
    ];
    var coordsDown = [
        {x: 11, y: 14},
        {x: 28, y: 15},
        {x: 45, y: 16},
        {x: 61, y: 17}
    ];

    for (indexDigit = 0; indexDigit < allDigits.length; indexDigit++) {

        if (textSlopeDirection) {
            canvasTestDigit = ctd.getImageData((indexDigit * digitWidth), 0, digitWidth, digitHeight);
        } else {
            canvasTestDigit = ctd.getImageData((indexDigit * digitWidth), digitHeight, digitWidth, digitHeight);
        }

        // Get each digit position until we have found them all.
        for (indexPosition = 0; indexPosition < captchaDigitsToFind; indexPosition++) {

            // Get the next captcha digit from the captcha image to compare.
            if (textSlopeDirection) {
                canvasCaptchaDigit = ctx.getImageData(coordsUp[indexPosition].x, coordsUp[indexPosition].y, digitWidth, digitHeight);
            } else {
                canvasCaptchaDigit = ctx.getImageData(coordsDown[indexPosition].x, coordsDown[indexPosition].y, digitWidth, digitHeight);
            }
            var result = compareDigit(canvasCaptchaDigit, canvasTestDigit);
            // Is this the best match so far?
            if (result.percentPixelsMatch > captchaDigitPercentage[indexPosition]) {
                captchaDigitPercentage[indexPosition] = result.percentPixelsMatch;
                captchaMatchPercentage[indexPosition] = result.percentCaptchaMatch;
                captchaValues[indexPosition]          = indexDigit;
            }
        }
    }

    // Special case just for the digit '8' which has its origin 1 pixel to the left of standard.
    if (!textSlopeDirection) {
        console.log("--- looking for the 8 ---");
        var indexDigit = 8;

        if (textSlopeDirection) {
            canvasTestDigit = ctd.getImageData((8 * digitWidth), 0, digitWidth, digitHeight);
        } else {
            canvasTestDigit = ctd.getImageData((8 * digitWidth), digitHeight, digitWidth, digitHeight);
        }

        // Get each digit position until we have found them all.
        for (indexPosition = 0; indexPosition < captchaDigitsToFind; indexPosition++) {

            // Get the next captcha digit from the captcha image to compare.
            if (textSlopeDirection) {
                canvasCaptchaDigit = ctx.getImageData(coordsUp[indexPosition].x +1, coordsUp[indexPosition].y, digitWidth, digitHeight);
            } else {
                canvasCaptchaDigit = ctx.getImageData(coordsDown[indexPosition].x +1, coordsDown[indexPosition].y, digitWidth, digitHeight);
            }
            var result = compareDigit(canvasCaptchaDigit, canvasTestDigit);
            // Is this the best match so far?
            if (result.percentPixelsMatch > captchaDigitPercentage[indexPosition]) {
                captchaDigitPercentage[indexPosition] = result.percentPixelsMatch;
                captchaMatchPercentage[indexPosition] = result.percentCaptchaMatch;
                captchaValues[indexPosition]          = indexDigit;
            }
        }
    }
    console.log(captchaValues);
    console.log(captchaMatchPercentage);
    $('#captchaGuess').text(captchaValues.join(captchaDigitSeparator));
    
    // Fill in the form field for message. http://stackoverflow.com/questions/7427163/trigger-keypresskeydown-with-jquery  
    var captchaText = captchaValues.join('')
    var field = $('#bbUserInput')
    field.focus();
    var e = jQuery.Event("keydown");
    //e.keyCode = 50;                     
    field.trigger(e);
    field.val(captchaText);  // This is what gets sent.
    field.text(captchaText);  // This is what shows up in the textarea.

    return captchaText;
}