/*!
 * Kijiji+ Site Enhancer v1.0.0 (https://github.com/twindual/kijiji-plus)
 * Copyright 2017 André Fortin.
 * Licensed under the GNU GPL (http://www.gnu.org/licenses/)
 */

// Insert rotation buttons for Kijiji Ad Details image gallery.
function insertRotationButtons() {
  logMessage("insertRotationButtons", "INIT", "info");

  // Only inject rotation code if there is an image gallery AND we have not already added it.
  if ($('#ImageLightBoxLink').length && !$('#ImageLightBoxLink').attr('rotateEventRegistered')) {    
    
    // Register the EVENT handler.
    $('a#ImageLightBoxLink.button-open.prev').on("click", function(event) {
      
      // Kijiji Image Gallery removes the [Rotate Image] button on image navigation because it is attached to
      // the image display element which is generated dynamically on Image Gallery navigation navigation.
      // This means we need to recreate it every time the view a different image in the gallery.
      if ($('#btnRotateImage').length < 1) {
        $('.mfp-figure').after('<div id="divImageRotate"><button id="btnRotateImage" class="button-open">Rotate Image</button></div>');
        $('div.mfp-figure > figure > img.mfp-img').attr('data-rotation', 0);
      }
    });

    // Add click handler for all the image gallery photo preview images.
    $('ul.photo-navigation li').each(function(index) {
      console.log('found image: ', index);
      $( this ).on("click", function(event) {
        // Kijiji Image Gallery removes the [Rotate Image] button on image navigation because it is attached to
        // the image display element which is generated dynamically on Image Gallery navigation navigation.
        // This means we need to recreate it every time the view a different image in the gallery.
        if ($('#btnRotateImage').length < 1) {
          $('.mfp-figure').after('<div id="divImageRotate"><button id="btnRotateImage" class="button-open">Rotate Image</button></div>');
          $('div.mfp-figure > figure > img.mfp-img').attr('data-rotation', 0);
        }
      });
    });

    $(document).on('click', '#btnRotateImage', rotateImageKijiji);  // Register the event handler.
    $('#ImageLightBoxLink').attr('rotateEventRegistered', true); // Don't duplicate the event registration.

    // Monitor width of the image container element to reset the maximum image size.
    // Resize image gallery rotation buttons when we get to skinny.
    window.addEventListener("resize", function() {
      var magicShrinkSize = 780; // Magic size that the Kijiji stylesheets starts shriking image to 70%.
      var viewportWidth = window.innerWidth;
      if (viewportWidth < magicShrinkSize) { 
        var maxImageHeight = 540;
        var lineHeight = ((maxImageHeight * viewportWidth) / magicShrinkSize) + 1; // Because we need to be bigger than the image for centering to work.
        $('div.mfp-figure > figure').css("line-height", lineHeight + "px");
      } else {
        $('div.mfp-figure > figure').css("line-height", "541px");
      }
    });
  }
}

// Rotate an image from the Kijiji Ad Detail image gallery.
function rotateImageKijiji(direction = 'right') {
  logMessage("rotateImageKijiji", "INIT", "info");

  // What direction are we rotating this image?
  if (direction !== 'right') {
    degrees = 90;
  } else {
    degrees = -90;
  }
  
  // 'Close-enough' selector because it changes where this is only a single image.
  var image = $('div.mfp-container.mfp-image-holder > div > div > div.mfp-figure > figure > img');
  if (image.length) {

    // Calculate the rotation angle.
    var rotation = parseInt(image.attr('data-rotation'), 10);
    if (isNaN(rotation)) {
      rotation = 0;
    }
    rotation = (rotation + degrees) % 360;

    // Finally rotate it and try to do it with cross-browser support.
    // Hopefully we will make plug-ins soon for the other major browsers.
    image.css({
      '-webkit-transform' : 'rotate(' + rotation + 'deg)',
      '-moz-transform'    : 'rotate(' + rotation + 'deg)',
      '-ms-transform'     : 'rotate(' + rotation + 'deg)',
      '-o-transform'      : 'rotate(' + rotation + 'deg)',
      'transform'         : 'rotate(' + rotation + 'deg)'
    });

    // save the attribute for next click
    image.attr('data-rotation', rotation);
  } else {
    // Error couldn't find image to rotate.
    logMessage("rotateImageKijiji", "Error, couldn't find image to rotate.", "warn");
  }

  return;  
}
