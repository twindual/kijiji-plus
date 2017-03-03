/*!
 * Kijiji+ Site Enhancer v1.0.0 (https://github.com/twindual/kijiji-plus)
 * Copyright 2017 André Fortin.
 * Licensed under the GNU GPL (http://www.gnu.org/licenses/)
 */

if (window.location.host === 'www.lespac.com') {

    // Add extension JS in page
    var s01 = document.createElement('script')
    s01.src = chrome.extension.getURL('javascript/jquery.infinitescroll.min.js')
    s01.onload = function() {
        this.parentNode.removeChild(this)
    }
    document.head.appendChild(s01)

    var s02 = document.createElement('script')
    s02.src = chrome.extension.getURL('lespac/javascript/all.js')
    s02.onload = function() {
        this.parentNode.removeChild(this)
    }
    document.head.appendChild(s02)

    // Add extension CSS in page
    var ss = document.createElement('link')
    ss.rel = 'stylesheet'
    ss.href = chrome.extension.getURL('lespac/stylesheets/all.css')
    document.head.appendChild(ss)

} else if (window.location.host.indexOf('kijiji') != -1) {

  // Add extension JS in page
  var s01 = document.createElement('script')
  s01.src = chrome.extension.getURL('javascript/jquery.infinitescroll.min.js')
  s01.onload = function() {
      this.parentNode.removeChild(this)
  }
  document.head.appendChild(s01)

  var s02 = document.createElement('script')
  s02.src = chrome.extension.getURL('kijiji/javascript/all.js')
  s02.onload = function() {
      this.parentNode.removeChild(this)
  }
  document.head.appendChild(s02)

  // Add extension CSS in page
  var ss = document.createElement('link')
  ss.rel = 'stylesheet'
  ss.href = chrome.extension.getURL('kijiji/stylesheets/all.css')
  document.head.appendChild(ss)

}
