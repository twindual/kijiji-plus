/*!
 * Kijiji+ Site Enhancer v1.0.0 (https://github.com/twindual/kijiji-plus)
 * Copyright 2017 André Fortin.
 * Licensed under the GNU GPL (http://www.gnu.org/licenses/)
 */

// Get a Static Google Map image from map coordinates.
function getMapFromGoogle(url, address) {
    logMessage("getMapFromGoogle", "INIT", "info");
    
    var successHandler = function(response) {
        console.log( response );
        var image = new Image();
        image.src = window.URL.createObjectURL(response);
        image.style.opacity = 1;
        image.height = '390';
        image.width = '547';
        image.style.maxWidth = '100%';

        // ToDo: Ad an AJAX spinner will we wait.
        var mapPreviewHtml = '<tr><td><hr/><h1>Map Preview</h1><a href="https://maps.google.com/maps?q=' + address + '" target="_blank" title="View In Google Maps" id="MapAdLocation" style="display: block"></a></td></tr>';
        var adDescriptionTabs = $('#AdDescriptionTabs');
        if (adDescriptionTabs.length > 0) {
            // Put the map after the tabs.
            adDescriptionTabs.after(mapPreviewHtml);
        } else {
            // Put the map after the description.
            $('#UserContent > table > tbody').append(mapPreviewHtml);
        }
        // Inject map with a title, description, and link to Google Maps.        
        $('#MapAdLocation').append(image);
    };

    // Google Maps API returns this result as a Blob.
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            successHandler(this.response);
        }
    };
    xhr.send();  
}

// Insert the Ad Details map into the page.
function enableKijijiMapPreview() {
  logMessage("enableKijijiMapPreview", "INIT", "info");
    
    if ($('#MapLink').length) {
        // Get the poster's address from the item details just above the 'View Map' link.
        var address = $('#MapLink').parent().text().split('\n')[0]; // This is also available in the META tags.
        address = encodeURIComponent(address); // Google Maps API expects URI encoded address.

        var successHandler = function(response) {
            if (typeof(response) !== 'undefined') {
                // Now get a map of the coordinates with Google Maps API.
                logMessage("enableKijijiMapPreview", response, "info");
                var coord = response.results[0].geometry.location;
                var url = 'https://maps.googleapis.com/maps/api/staticmap?center=' + coord.lat + ',' + coord.lng + '&zoom=' + settings.mapZoomLevel.value + '&size=547x390&markers=color:blue%7C' + coord.lat + ',' + coord.lng + '&maptype=roadmap&sensor=true';
                getMapFromGoogle(url, address);
            }
        }

        // GeoCode the poster's address with Google Maps API.
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=true';
        getJSON(url, successHandler);
    }
}
