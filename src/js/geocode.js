/*!
 * Kijiji+ Site Enhancer v1.0.0 (https://github.com/twindual/kijiji-plus)
 * Copyright 2017 André Fortin.
 * Licensed under the GNU GPL (http://www.gnu.org/licenses/)
 */

// GeoCode services wrapper.

// GeoCode a URI Encoded address.
// Params: 
//   ** REQUIRED **
//   - address
//   - successHandler
//   ** OPTIONAL **
//   - errorHandler
//   - service: (google)
function geocodeAddress(params) {
    logMessage("geocodeAddress", "INIT", "info");

    var defaultGeoCodeService = 'google'; // Set the default GeoCode service to Google Maps API.
    
    if ('address' in params) {
        if (typeof(address) == 'string') {
            logMessage("geocodeAddress", "address == [" + address + "]");
            if (!('service' in params)) {
                params.service = defaultGeoCodeService;
            }
            if ('errorHandler' in params) { // Set a default error handler.
                if (typeof(errorHandler) !== 'function') {
                    logMessage("geocodeAddress", "Error handler is not a function.", "warn");
                    params.errorHandler = function (){};
                }
            } else {
                logMessage("geocodeAddress", "Setting default error handler.", "info");
                params.errorHandler = function (){};
            }
            if ('successHandler' in params) {   // Validate success handler.
                if (typeof(successHandler) == 'function') {

                    switch (service) {
                        case 'google':
                            // Fall-throught to default.
                            // ----------------------------------------------------------------------------------------------------------
                            // Google Maps Geocoding API web service has a quota of 2,500 requests per day.
                            // In addition to daily quota limits, the geocoding service is rate limited to 50 QPS (queries per second), 
                            // calculated as the sum of client-side and server-side queries.
                        default:
                            var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=true';
                            getUrl({method: 'GET', url: url, successHandler: successHandler, errorHandler: errorHandler});
                            break;
                    }
                } else {
                    logMessage("geocodeAddress", "Success handler is not a function.", "warn");
                }
            } else {
                logMessage("geocodeAddress", "No success handler provided.", "warn");
            }
        } else {
            logMessage("geocodeAddress", "Address is not a string.", "warn");
        }
    } else {
        logMessage("geocodeAddress", "No address to GeoCode.", "warn");
    }
}