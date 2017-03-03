/*!
 * Kijiji+ Site Enhancer v1.0.0 (https://github.com/twindual/kijiji-plus)
 * Copyright 2017 André Fortin.
 * Licensed under the GNU GPL (http://www.gnu.org/licenses/)
 */

// De-duplicate array.
/* http://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items */
function arrayUnique(array) {
    var a = array.concat();
    for (var i=0; i<a.length; ++i) {
        for (var j=i+1; j<a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}

// Get JSON response from XHR request.
var getJSON = function(url, successHandler, errorHandler) {
	var xhr = typeof XMLHttpRequest != 'undefined'
		? new XMLHttpRequest()
		: new ActiveXObject('Microsoft.XMLHTTP');
	xhr.open('get', url, true);
	xhr.onreadystatechange = function() {
		var status;
		var data;
    var DONE = 4;       // Status code for XHR request
    var SUCCESS = 200;  // Result code for XHR request
		// https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
		if (xhr.readyState == DONE) {
			status = xhr.status;
			if (status == SUCCESS) {
				data = JSON.parse(xhr.responseText);
				successHandler && successHandler(data);
			} else {
				errorHandler && errorHandler(status);
			}
		}
	};
	xhr.send();
};

// Get an object's css styles.
/* http://stackoverflow.com/questions/6594105/jquery-passing-css-from-one-element-to-another */
function getStyleObject(element) {

  // ToDo: Check why window.getComputedStyle throws an error:
  //       Uncaught TypeError: Failed to execute 'getComputedStyle' on 'Window': parameter 1 is not of type 'Element'
  var dom = element.get(0);
  var style;
  var returns = {};
  if (window.getComputedStyle) {
    var camelize = function(s) {
      return s.replace(/-(.)/g, function(a, $1){
        return $1.toUpperCase();
      });
    }
    style = window.getComputedStyle(dom, null);
    for (var i = 0; i < style.length; i++) {
      var prop = style[i];
      //console.log("prop  == " + prop);
      var camel = prop.replace(/\-([a-z])/g, camelize);
      //console.log("camel == " + camel);
      var val = style.getPropertyValue(prop);
      returns[camel] = val;
    }
    return returns;
  }
  if (dom.currentStyle) {
    style = dom.currentStyle;
    for (var prop in style) {
      returns[prop] = style[prop];
    }
    return returns;
  }

  return element.css();
}

// Wrapper to make an XHR call since chrome extension doesn't like "$.ajax"
// Assume method is 'GET' if none set simply for convenience.
// XHR method name checked against W3 spec at https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html.
// Throws 'IllegalArgumentException' on XHR param errors.
function getUrl(params) {
  logMessage('getUrl', 'INIT');

  // Sanity check the input.
  if (typeof(params) == 'object') {
    
    var DONE = 4;       // Status code for XHR request
    var SUCCESS = 200;  // Result code for XHR request
    var xhr = typeof XMLHttpRequest != 'undefined'
      ? new XMLHttpRequest()
      : new ActiveXObject('Microsoft.XMLHTTP');
    
    // Validate our XHR params.
    if ('method' in params) {
      var methods = [ 'GET', 'POST', 'CONNECT', 'DELETE', 'HEAD', 'OPTIONS', 'PUT', 'TRACE'];
      if (methods.indexOf(params.method) == -1) {
        logMessage('getUrl', 'Invalid XHR method argument == [' + params.method + ']. It must be one of [GET, POST, CONNECT, DELETE, HEAD, OPTIONS, PUT, TRACE]');
        throw new Error('IllegalArgumentException');
      }
    } else {
      params.method = 'GET';  // Assume "GET" if no method set.
    }
    if ('url' in params) {
      if ('user' in params) {
        if ('password' in params) {
          xhr.open(params.method, params.url, true, params.user, params.password);
        } else {
          xhr.open(params.method, params.url, true, params.user);
        }
      } else {
        xhr.open(params.method, params.url, true);
      }
    } else {
        logMessage("getUrl", "No XHR url param exists.", "warn");
        throw new Error('IllegalArgumentException');
    }

    xhr.onreadystatechange = function() {
  		// https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
      if (xhr.readyState == DONE) {
        status = xhr.status;
        if (status == SUCCESS) {
          if('successHandler' in params) {
            params.successHandler && params.successHandler(xhr.responseText);
          } else {
            logMessage("getUrl", "No successHandler function in param object exists.", "warn");
            throw new Error('IllegalArgumentException');
          }
        } else {
          errorHandler && errorHandler(status);
          if('errorHandler' in params) {
            console.log(xhr.responseText);
            params.successHandler && params.errorHandler(xhr.responseText);
          }
        }
      }
    };
    xhr.send();
  } else {
    logMessage("getUrl", "No param object exists.", "warn");
    throw new Error('IllegalArgumentException');
  }
}

// Log message to the console.
function logMessage(name, message, severity = 'info') {
  if (settings.enableDebugOutput.value == true) {
    var listSeverity = ['info', 'warn', 'error'];
    if (listSeverity.indexOf(severity) == -1) {
      severity = 'unknown';
    }
    console.log("type: [ " + severity + " ] | " + name + " | " + message);
  }
}