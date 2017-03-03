/*global jQuery: true */

/*!
   --------------------------------
   Infinite Scroll
   --------------------------------
   + https://github.com/paulirish/infinite-scroll
   + version 2.1.0
   + Copyright 2011/12 Paul Irish & Luke Shumard
   + Licensed under the MIT license

   + Documentation: http://infinite-scroll.com/
*/
// Uses jQuery version 1.9 +

// Uses AMD or browser globals to create a jQuery plugin.
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Use browser globals.
        factory(jQuery);
    }
}(function ($, undefined) {
    'use strict';

    $.infinitescroll = function infscr(options, callback, element) {
        this.element = $(element);

        // Flag the object in the event of a failed creation.
        if (!this._create(options, callback)) {
            this.failed = true;
        }
    };

    $.infinitescroll.defaults = {
        debug: false,               // Diplays debugging message via console.log().
        infid: 0,                   // Instance ID

        // Page result loading params.
        loading: {
            // Function hooks.
            start:          undefined,  // Deprecated, use onStart.
            finished:       undefined,  // Deprecated, use onAppend.

            // Message display params.
            selector: null,         // Puts the load message in a specific selector. Defaults to the contentSelector.
            msgText: undefined,     // Deprecated, use loadingMsg.
            finishedMsg: undefined, // Deprecated, use completeMsg.
            completeMsg: '<em>Congratulations, you\'ve reached the end of the internet.</em>',
            loadingMsg: '<em>Loading the next set of posts...</em>',
            msg: null,              // Defaults to $('<div id="infscr-loading"><img id="infscr-loadingSpinner" alt="Loading..." src="' + opts.loading.img + '" /><span id="infscr-loadingMsg">' + opts.loading.loadingMsg + '</span></div>');
            speed: 'fast',          // When 'animate' is TRUE it sets the speed of the jQuery animate function.
            img:            'data:image/gif;base64,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',
        },

        // Object state.
        state: {
            isBeyondMaxPage: false,
            isDestroyed: false,
            isDone: false,          // TRUE when no more results pages to fetch.
            isDuringAjax: false,
            isInvalidPage: false,
            isPaused: false,
            currPage: 1
        },

// ===========================================================================
        // jQuery selectors.
        //navSelector: 'a [title="Next"]',
        //nextSelector: 'div.navigation a:first',
        //itemSelector: 'div [data-ad-id]',
        //contentSelector: undefined,      // rename to pageFragment
        //binder: $(window),          // Cache reference to selector.
// ===========================================================================

        errorCallback: undefined,   // Callback function
        
        // jQuery selectors.
        containterSelector: 'div.container-results', // * NEW *
        navSelector: 'div.pagination',
        nextSelector: 'div a[title="Next"]',
        itemSelector: 'div [data-ad-id]',
        contentSelector: undefined,      // Rename to pageFragment. 'page fragment' option for .load() / .ajax() calls.
        binder: $(window),          // Cache reference to selector.

        // Positioning params.
        animate: false,             // Use smooth scrolling to ease in the new content.
        bufferPx: 40,               // Add extra height to distance remaining in the scroll area. Used when calculating trigger for next page load.
        extraScrollPx: 150,         // Add extra height when smooth scrolling in new content.
        pixelsFromNavToBottom: undefined,   // Used when calculating trigger for next page load.
        prefill: false,             // IF the document is smaller than the window THEN load data until the document is larger OR links are exhausted.


        // Result page number params.
        path: undefined,            // Either parts of a URL as an array (e.g. ["/page/", "/"] or a function that takes the page number and returns a URL.
        pathParse: undefined,       // Callback function to parse the HREF of [Next Page] <A> element to extract the page number.
        pathMatch: false,           // Check if current browser path is same as ajax pagination path
        maxPage: undefined,         // Manually controls maximum page: (IF maxPage is undefined THEN maximum page limitation will not work).

        // AJAX params.
        appendCallback: true,       // Append next page of returned items to existing result list or not.
        dataType: 'html',           // Default datatype of fetched paged results. Values are: ()'html', 'html+callback', 'json')
        template: undefined,        // IF dataType == 'json' AND appendCallback == TRUE THEN you must define this function to parse JSON to HTML.

        // Used to over-ride existing functionality. Need to add an function to the initialization options that begins with the same function name 
        // you want to over-ride followed by the underscore '_', and followed by whatever unique string value you set in 'behaviour'.
        // You can only use this to over-ride a single function.
        behavior: undefined,        // Deprecated, use function over-rides. Used to overide default behaviour of existing functionality.

        // DEPRECATED User defined callback functions.
        //callback: undefined,        // Deprecated, use onUpdate.
        errorCallback: undefined,   // Deprecated, use onComplete.

        // User defined callback functions.
        callbacks: {
            onBegin:    undefined,  // Triggers BEFORE fetch of next page results.
            onFetch:    undefined,  // Triggers AFTER fetching data from next page results, and BEFORE onAppend.
            onAppend:   undefined,  // Triggers AFTER appending the data to existing results list.
            onUpdate:   undefined,  // Triggers AFTER scrolling the window to start of new items.
            onComplete: undefined   // Triggers AFTER fetching the final page of results, AND appending the data to existing results list, AND scrolling the window to start of new items.
        },

        // ToDo: Enable these over-rides while maintaining backwards compatibility with old using 'behavior' option.
        // Over-ride existing functionality of Infinite Scroll.
        overrides: {
            // Private Over-rides.
            onBinding:          undefined,  // Replaces _binding.
            onDeterminePath:    undefined,  // Replaces _determinepath.
            onError:            undefined,  // Replaces _error.
            onLoad:             undefined,  // Replaces _loadcallback.
            onNearBottom:       undefined,  // Replaces _nearbottom.
            onPause:            undefined,  // Replaces _pausing.
            onSetup:            undefined,  // Replaces _setup.
            onShowDoneMsg:      undefined,  // Replaces _showdonemsg.
            
            // Public Over-rides.
            onRetrieve:         undefined,  // Replaces retrieve.
            onScroll:           undefined   // Replaces scroll.
        }
    };


// ===========================================================================



    $.infinitescroll.prototype = {

        /*
        ----------------------------
        Private methods
        ----------------------------
        */

        // Bind or unbind from scroll event.
        // Requires jQuery >= 1.7 to support .on() and .off()
        // NOTE: jQuery 3.0+ deprecates .bind() and .unbind()
        _binding: function infscr_binding(isBind = true) {
            var opts = this.options;
            var instance = this;

            // IF behavior is defined AND this function is extended THEN call that instead of default.
            if (!!opts.behavior && this['_binding_' + opts.behavior] !== undefined) {
                this['_binding_' + opts.behavior].call(this, isBind);
            } else {
                // Bind or unBind the 'smartscroll' event for this instance.
                this._debug('INFO | Binding ==', isBind);
                var eventType = 'smartscroll.infscr.' + this.options.infid;
                if (isBind) {
                    // This needs to be updated to .on()
                    $(this.options.binder).on(eventType, function () { instance.scroll(); });
                } else {
                    $(this.options.binder).off(eventType);
                }
            }
        },

         // Fundamental aspects of the plugin are initialized.
        _create: function infscr_create(options, callback) {

            // Add custom options to defaults.
            var opts = $.extend(true, {}, $.infinitescroll.defaults, options);
            this.options = opts;
            var instance = this;
            var $window = $(window);

            opts.version = '2.1.2';     // Update the version number.

            // Validate selectors.
            if (!instance._validate(opts)) {
                // Error. No selectors to validate.
                this._debug('ERROR | No element selectors have been set.');
                return false;
            }

            // Validate page fragment path.
            var path = $(opts.nextSelector).attr('href');
            if (!path) {
                this._debug('ERROR | Next page selector \'nextSelector\' == [' + opts.nextSelector + '] found no elements with an \'HREF\' attribute.');
                return false;
            }

            // Validate maxPage number.
            if (typeof(opts.maxPage) == 'string') {
                // Convert it to a number if its a string.
                var maxPage = parseInt(opts.maxPage);
                opts.maxPage = isNaN(maxPage) ? undefined : maxPage;
            } else {
                // If its not a number then unset it.
                if (typeof(opts.maxPage) !== 'number') {
                    opts.maxPage = undefined;
                }
            }

            // Set the path to be a relative URL from root.
            opts.path = opts.path || this._determinepath(path);

            // contentSelector is 'page fragment' option for .load() / .ajax() calls.
            opts.contentSelector = opts.contentSelector || this.element;

            // loading.selector - Puts the load message in a specific selector. Defaults to the contentSelector.
            opts.loading.selector = opts.loading.selector || opts.contentSelector;

            // Check for deprecated params.
            if (opts.loading.msgText !== undefined && opts.loading.loadingMsg == undefined) {
                opts.loading.loadingMsg = opts.loading.msgText;
            }
            if (opts.loading.finishedMsg !== undefined && opts.loading.completeMsg == undefined) {
                opts.loading.completeMsg = opts.loading.finishedMsg;
            }

            // Define the loading.msg
            opts.loading.msg = opts.loading.msg || $('<div id="infscr-loading"><img alt="Loading..." src="' + opts.loading.img + '" /><div>' + opts.loading.loadingMsg + '</div></div>');

            // Preload the loading.img
            (new Image()).src = opts.loading.img;

            // Distance from nav links to bottom of page.
            // Computed as: height of the document - top offset of nav element
            if(opts.pixelsFromNavToBottom === undefined) {
                opts.pixelsFromNavToBottom = $(document).height() - $(opts.navSelector).offset().top;
                this._debug('INFO | pixelsFromNavToBottom == [' + opts.pixelsFromNavToBottom + ']');
            }

            // Configure [onStart] event. -- Added code to migrate deprecated options.
            if (opts.loading.start !== undefined && opts.callbacks.onBegin == undefined) {
                opts.callbacks.onBegin = opts.loading.start;
            } else if (opts.callbacks.onBegin == undefined) {
                // Create default action.
                opts.callbacks.onBegin = function() {
                    $(opts.navSelector).hide();
                    $(opts.loading.selector).after(opts.loading.msg);
                    opts.loading.msg.show(opts.loading.speed, $.proxy(function() {
                        this.beginAjax(opts);
                    }, instance));
                };
            }

            // Configure [onAppend] event. No existing callback event for onFetch.
            if (opts.callbacks.onFetch == undefined) {
                // Create default action.
                opts.callbacks.onFetch = function() { };
            }
            
            // Configure [onAppend] event. -- Added code to migrate deprecated options.
            if (opts.loading.finished !== undefined && opts.callbacks.onAppend == undefined) {
                opts.callbacks.onAppend = opts.loading.finished;
            } else if (opts.callbacks.onAppend == undefined) {
                // Create default action.
                opts.callbacks.onAppend = function () { };
            }

            // Configure [onUpdate] event. -- Added code to migrate deprecated options.
            if (callback !== undefined && opts.callbacks.onUpdate == undefined) {
                opts.callbacks.onUpdate = callback;
            } else if (opts.callbacks.onUpdate == undefined) {
                // Create default action.

// ====================================================================================================
// This comes from the v2.1.0 codebase.
// ----------------------------------------------------------------------------------------------------
                opts.callbacks.onUpdate = function(instance, data, url) {
                    // Call an over-ride function if it was defined as a behaviour.
                    if (!!opts.behavior && instance['_callback_' + opts.behavior] !== undefined) {
                        instance['_callback_' + opts.behavior].call($(opts.contentSelector)[0], data, url);
                    }
                    // Call the onAppend callback if defined.
                    if (callback) {
                        callback.call($(opts.contentSelector)[0], data, opts, url);
                    }
                    // Prefill the new results item area if TRUE.
                    if (opts.prefill) {
                        $window.on('resize.infinite-scroll', instance._prefill);
                    }
                };
// ====================================================================================================
            }


            // Configure [onComplete] event. -- Added code to migrate deprecated options.
            if (opts.errorCallback !== undefined && opts.callbacks.onComplete == undefined) {
                opts.callbacks.onComplete = opts.errorCallback;
            } else if (opts.callbacks.onComplete == undefined) {
                // Create default action.
                opts.callbacks.onComplete = function() {
                    if (!opts.state.isBeyondMaxPage) {
                        opts.loading.msg.fadeOut(opts.loading.speed);
                    }
                };
            }

            // Are we going to log debugging messages to the console?
            if (options.debug) {
                // Tell IE9 to use its built-in console.
                if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log === 'object') {
                    ['log','info','warn','error','assert','dir','clear','profile','profileEnd']
                        .forEach(function (method) {
                            console[method] = this.call(console[method], console);
                        }, Function.prototype.bind);
                }
            }

            this._prefill();        // Setup the prefill method for use.
            this._setup();          // Trigger user callback AFTER initialization and BEFORE binding()
            this._binding(true);    // Bind to scroll event.

            return true;            // Return TRUE to indicate successful creation.
        },

        // IF the document is smaller than the window THEN 
        //    load data until the document is larger than the window OR links are exhausted.
        _prefill: function infscr_prefill() {            
            if (this.options.prefill) {
                var instance = this;
                var $window = $(window);

                function needsPrefill() {
                    return ( $(instance.options.contentSelector).height() <= $window.height() );
                }

                this._prefill = function() {
                    if (needsPrefill()) {
                        instance.scroll();
                    }
                    $window.on('resize.infinite-scroll', function() {
                        if (needsPrefill()) {
                            $window.off('resize.infinite-scroll');
                            instance.scroll();
                        }
                    });
                };

                // Call self after setting up the new function
                this._prefill();
            }
        },

        // Console log wrapper.
        _debug: function infscr_debug() {
            if (true !== this.options.debug) {
                return;
            }

            if (typeof console !== 'undefined' && typeof console.log === 'function') {
                // Modern browsers
                // Single argument, which is a string.
                if ((Array.prototype.slice.call(arguments)).length === 1 && typeof Array.prototype.slice.call(arguments)[0] === 'string') {
                    console.log( (Array.prototype.slice.call(arguments)).toString() );
                } else {
                    console.log( Array.prototype.slice.call(arguments) );
                }
            } else if (!Function.prototype.bind && typeof console !== 'undefined' && typeof console.log === 'object') {
                // IE8
                Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
            }
        },

        // Find the number to increment in the path.
        _determinepath: function infscr_determinepath(path) {
            var opts = this.options;

            // IF behavior is defined AND this function is extended THEN call that instead of default.
            if (!!opts.behavior && this['_determinepath_' + opts.behavior] !== undefined) {
                return this['_determinepath_' + opts.behavior].call(this, path);
            }

            if (!!opts.pathParse) {
                this._debug('INFO | pathParse value is not set. Incrementing currPage by +1.');
                return opts.pathParse(path, opts.state.currPage + 1);
            } else if (path.match(/^(.*?page=)2(\/.*|$)/)) {
                path = path.match(/^(.*?page=)2(\/.*|$)/).slice(1);
                return path;
            } else if (path.match(/^(.*?)\b2\b(.*?$)/)) {
                path = path.match(/^(.*?)\b2\b(.*?$)/).slice(1);

                // IF there is a '2' in the url.
            } else if (path.match(/^(.*?)2(.*?$)/)) {

                // page= is used in Django:
                // http://www.infinite-scroll.com/changelog/comment-page-1/#comment-127
                if (path.match(/^(.*?page=)2(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)2(\/.*|$)/).slice(1);
                    return path;
                }
                path = path.match(/^(.*?)2(.*?$)/).slice(1);

            } else {
                // page= is used in Drupal too but second page is page=1 not page=2:
                // thx Jerod Fritz, vladikoff
                if (path.match(/^(.*?page=)1(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)1(\/.*|$)/).slice(1);
                    return path;
                } else {
                    this._debug("ERROR | Sorry, we couldn't parse your Next (Previous Posts) URL. Verify your the css selector points to the correct <A> tag. If you still get this error: yell, scream, and kindly ask for help at http://infinite-scroll.com.");
                    // Get rid of isInvalidPage to allow permalink to state
                    opts.state.isInvalidPage = true;  // prevent it from running on this page.
                }
            }
            this._debug('INFO | determinePath == [' + path + ']');

            return path;
        },

        // Custom error handler.
        // Param (xhr) gets passed to over-ride function.
        // In default logic: only a param value of 'end' has any effect, it triggers the _showdonemsg function.
        _error: function infscr_error(xhr) {
            var opts = this.options;

            // IF behavior is defined AND this function is extended THEN call that instead of default.
            if (!!opts.behavior && this['_error_' + opts.behavior] !== undefined) {
                this['_error_' + opts.behavior].call(this, xhr);
                return;
            }

            if (xhr !== 'destroy' && xhr !== 'end') {
                xhr = 'unknown';
            }

            this._debug('ERROR | error == [' + xhr + ']');

            if (xhr === 'end' || opts.state.isBeyondMaxPage) {
                this._showdonemsg();
            }

            // Clean-up settings.
            opts.state.isDone = true;
            opts.state.currPage = 1;    // IF you need to get back to this instance.
            opts.state.isPaused = false;
            opts.state.isBeyondMaxPage = false;
            this._binding(false);
        },

        // Load Callback funtion.
        // ToDo: This function name is not really descriptive of what it does.
        //       Needs a more descriptive name, and while we are at it lets break it into 2 function.
        //       - Fetch the data, trigger onFetch, check end of results, b
        //       - Display and trigger onUpdate callback.
        //       
        _loadcallback: function infscr_loadcallback(box, response, url) {
            console.log('box ==',box);
            console.log('url ==', url);

            var data = '';
            var frag = '';
            var opts = this.options;

            // Enable or disable triggering the user defined callback function for append data.
            var callback = this.options.callback; // GLOBAL OBJECT FOR CALLBACK
            var retVal = true;  // TRUE on success.

            // Trigger callback function if defined and update internal state and result set.
            //var callbackResults = opts.callbacks.onFetch.call(opts, url, response);
            var params = {'url': url, 'options': opts, 'box': box, 'response': response};
            var callbackResults = opts.callbacks.onFetch.call(this, params);
            this._debug('result of onFetch ==', callbackResults);
            if (typeof(callbackResults) != 'undefined') {
                // Update the result set of it exists.
                if (typeof(callbackResults.data) !== 'undefined') {
                    response = callbackResults.data;
                }                
                // Only update the options if it exists.
                if (typeof(callbackResults.options) !== 'undefined') {
                    this.options.options = callbackResults.options;
                    opts = this.options;
                }
            }

            // Skip default 'append' logic when the onFetch event is defined.
            var result = 'no-append';
            if (opts.state.isDone) {
                result = 'done';
            } else {
                if (opts.appendCallback) {
                    result = 'append';
                }
            }
            this._debug('INFO | infscr state ==', result);

            // IF behavior is defined AND this function is extended THEN call that instead of default.
            if (!!opts.behavior && this['_loadcallback_' + opts.behavior] !== undefined) {
                this['_loadcallback_' + opts.behavior].call(this, box, response, url);
                return;
            }

            switch (result) {
                case 'done':
                    this._debug('INFO | All done.');
                    opts.state.isDone = true;
                    this._showdonemsg();
                    retVal = false;
                    break;

                case 'no-append':
                    if (opts.dataType === 'html') {
                        data = '<div>' + response + '</div>';
                        data = $(data).find(opts.itemSelector);
                    }

                    // Next page results load returned nothing.
                    if (response.length === 0) {
                        this._debug('INFO | No search result items returned.');
                        opts.state.isDone = true;
                        retVal = this._error('end');
                    }
                    break;

                case 'append':
                    var children = box.children();
                    // if it didn't return anything
                    if (children.length === 0) {
                        this._debug('INFO | No search result items returned.');
                        opts.state.isDone = true;
                        retVal = this._error('end');
//                        return this._error('end');
                    } else {
                        // Use a documentFragment because it works when content is going into a <table>, <ol>, <ul>, or <div>.
                        frag = document.createDocumentFragment();
                        while (box[0].firstChild) {
                            frag.appendChild(box[0].firstChild);
                        }

                        this._debug('INFO | contentSelector ==', $(opts.contentSelector)[0]);
                        $(opts.contentSelector)[0].appendChild(frag);
                        
                        // Previously, we would pass in the new DOM element as context for the callback.
                        // However we're now using a documentfragment, which doesn't have parents or children.
                        // So the context of the result items is the content container specified by opt.contentSelctor.
                        // We pass in an array of the elements collected as the first argument.
                        data = children.get();
                    }
                    break;

                default:
            }

            // ToDo: This should really be in its own function.
            if (!opts.state.isDone) {

                // Trigger onAppend callback and pass it the returned data and the Infinite Scroll options.
                opts.callbacks.onAppend.call($(opts.contentSelector)[0], opts);

                // Use smooth scrolling to ease in the new content.
                if (opts.animate) {
                    var scrollTo = $(window).scrollTop() + $(opts.loading.msg).height() + opts.extraScrollPx + 'px';
                    $('html,body').animate({ scrollTop: scrollTo }, 800, function () { opts.state.isDuringAjax = false; });
                } else {
                    // Once the call is done, we can allow it again.
                    opts.state.isDuringAjax = false;
                }

                // Trigger onUpdate callback -- We have completed updating the search results.
                opts.callbacks.onUpdate.call($(opts.contentSelector)[0], data, opts, url);

                if (opts.prefill) {
                    this._prefill();
                }
            }

            return retVal;
       },

        _nearbottom: function infscr_nearbottom() {
            var opts = this.options;
            var pixelsFromWindowBottomToBottom = 0 + $(document).height() - (opts.binder.scrollTop()) - $(window).height();

            // IF behavior is defined AND this function is extended THEN call that instead of default.
            if (!!opts.behavior && this['_nearbottom_' + opts.behavior] !== undefined) {
                return this['_nearbottom_' + opts.behavior].call(this);
            }

            this._debug('INFO | math:', pixelsFromWindowBottomToBottom, opts.pixelsFromNavToBottom);

            // IF the distance remaining in the scroll (including buffer) is less than the orignal nav to bottom....
            return (pixelsFromWindowBottomToBottom - opts.bufferPx < opts.pixelsFromNavToBottom);
        },

        // (Pause / temporarily disable) plugin from firing events.
        _pausing: function infscr_pausing(pause = 'toggle') {
            var opts = this.options;

            // IF behavior is defined AND this function is extended THEN call that instead of default.
            if (!!opts.behavior && this['_pausing_' + opts.behavior] !== undefined) {
                this['_pausing_' + opts.behavior].call(this, pause);
                return;
            }

            // IF pause state IS NOT 'pause' OR 'resume' THEN toggle it's value.
            if (pause !== 'pause' && pause !== 'resume' && pause !== null) {
                this._debug('INFO | Invalid argument. Toggling pause state instead.');
            }

            pause = (pause && (pause === 'pause' || pause === 'resume')) ? pause : 'toggle';

            switch (pause) {
                case 'pause':
                    opts.state.isPaused = true;
                    break;

                case 'resume':
                    opts.state.isPaused = false;
                    break;

                case 'toggle':
                    opts.state.isPaused = !opts.state.isPaused;
                    break;
            }

            this._debug('INFO | Paused == [' + opts.state.isPaused + ']');
            return false;
        },

        // Behavior is determined.
        // IF the behavior option is undefined THEN it will set to default and bind to scroll.
        _setup: function infscr_setup() {
            var opts = this.options;

            // IF behavior is defined AND this function is extended THEN call that instead of default.
            if (!!opts.behavior && this['_setup_' + opts.behavior] !== undefined) {
                this['_setup_' + opts.behavior].call(this);
                return;
            }
        },

        // Show done message.
        _showdonemsg: function infscr_showdonemsg() {
            var opts = this.options;

            // IF behavior is defined AND this function is extended THEN call that instead of default.
            if (!!opts.behavior && this['_showdonemsg_' + opts.behavior] !== undefined) {
                this['_showdonemsg_' + opts.behavior].call(this);
                return;
            }

            // Trigger onShowDoneMsg event callback.
            if (!!opts.callbacks.onShowDoneMsg) {
                opts.callbacks.onShowDoneMsg.call(this);
                return;
            }

            opts.loading.msg
                .find('img')
                .hide()
                .parent()
                .find('div')
                .html(opts.loading.completeMsg)
                .animate({ opacity: 1 }, 2000, function () {
                    $(this).parent().fadeOut(opts.loading.speed);
                });

            // Execute user provided callback when done.
            opts.callbacks.onComplete.call($(opts.contentSelector)[0], 'done');
        },

        // Verify if each user provided selector actually finds an element.
        _validate: function infscr_validate(opts) {
            var isValid = true;  // Assume success.
            for (var key in opts) {
                if (key.indexOf && key.indexOf('Selector') > -1 && $(opts[key]).length === 0) {
                    this._debug('ERROR | Your selctor [' + key + ':' + opts[key] + '] found no elements.');
                    isValid = false;
                }
            }

            return isValid;
        },


        /*
        ----------------------------
        Public methods
        ----------------------------
        */

        // Bind to scroll.
        bind: function infscr_bind() {
            this._binding(true);
        },

        // Destroy current instance of plugin.
        destroy: function infscr_destroy() {
            this.options.state.isDestroyed = true;
            this.options.loading.finished();
            return this._error('destroy');
        },

        // Set pause value to FALSE.
        pause: function infscr_pause() {
            this._pausing('pause');
        },

        // Set pause value to FALSE
        resume: function infscr_resume() {
            this._pausing('resume');
        },

// =================================================================================

// =================================================================================

// =================================================================================


        // Fetch a page via AJAX.
        beginAjax: function infscr_ajax(opts) {
            var instance = this;
            var path = opts.path;
            var box, desturl, method, condition;

            // Increment the URL bit. e.g. /page/3/
            opts.state.currPage++;

            // Manually control the maximum page value.
            if ((opts.maxPage !== undefined) && (opts.state.currPage > opts.maxPage)) {
                opts.state.isBeyondMaxPage = true;
                this.destroy();
                return;
            }

            // IF we're dealing with a table THEN we can't use <DIV>s.
            box = $(opts.contentSelector).is('table, tbody') ? $('<tbody/>') : $('<div/>');
            desturl = (typeof path === 'function') ? path(opts.state.currPage) : path.join(opts.state.currPage);

            // IF pathMatch set to true THEN compare current path to pagination path.
            if ( opts.pathMatch !== undefined && opts.pathMatch == true ){
                var splitPath = desturl.split('?');
                var pagePath = splitPath[0];
                var currentPath = window.location.pathname;

                if(pagePath != currentPath){
                    instance._debug('ERROR | Pagination path [' + pagePath + '] IS NOT the same as current path [' + currentPath + '].');
                    instance._error('end');
                    this.destroy();
                    return;
                }
            }

            instance._debug('INFO | Preparing to fetch page results from url: [' + desturl + '].');

            method = (opts.dataType === 'html' || opts.dataType === 'json' ) ? opts.dataType : 'html+callback';
            if (opts.appendCallback && opts.dataType === 'html') {
                method = 'html+callback';
            }
            logMessage('INFO | ajax method ==', method);

            switch (method) {
                case 'html+callback':
                    instance._debug('INFO | Fetching HTML via .load() method.');
                    box.load(desturl + ' ' + opts.itemSelector, undefined, function infscr_ajax_callback(responseText) {
                        instance._loadcallback(box, responseText, desturl);
                    });
                    break;

                case 'html':
                    instance._debug('INFO | Fetching ' + method.toUpperCase() + ' via $.ajax() method.');
                    $.ajax({
                        // params
                        url: desturl,
                        dataType: opts.dataType,
                        complete: function infscr_ajax_callback(jqXHR, textStatus) {
                            condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === 'success' || textStatus === 'notmodified');
                            if (condition) {
                                instance._loadcallback(box, jqXHR.responseText, desturl);
                            } else {
                                instance._error('end');
                            }
                        }
                    });
                    break;

                case 'json':
                    instance._debug('INFO | Fetching ' + method.toUpperCase() + ' via $.ajax() method.');
                    $.ajax({
                        dataType: 'json',
                        type: 'GET',
                        url: desturl,
                        success: function (data, textStatus, jqXHR) {
                            condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === 'success' || textStatus === 'notmodified');
                            if (opts.appendCallback) {
                                // IF appendCallback is true THEN you must define a template in the initialization options.
                                // NOTE: The data passed into _loadcallback is already an html (after processed in opts.template(data)).
                                if (opts.template !== undefined) {
                                    var theData = opts.template(data);
                                    box.append(theData);
                                    if (condition) {
                                        instance._loadcallback(box, theData);
                                    } else {
                                        instance._error('end');
                                    }
                                } else {
                                    instance._debug('ERROR | No template for ' + method.toUpperCase() + ' data Found. It must be defined in the Infinite Scroll options.');
                                    instance._error('end');
                                }
                            } else {
                                // IF appendCallback is false THEN we will pass in the raw JSON object.
                                // NOTE: You should handle it yourself in your callback.
                                if (condition) {
                                    instance._loadcallback(box, data, desturl);
                                } else {
                                    instance._error('end');
                                }
                            }
                        },
                        error: function() {
                            instance._debug('ERROR | AJAX request for JSON data failed.');
                            instance._error('end');
                        }
                    });
                    break;
                
                default:
            }
        },

// =================================================================================

// =================================================================================

// =================================================================================

        // Retrieve the next set of content items.
        retrieve: function infscr_retrieve(pageNum = null) {
            var opts = this.options;
            
            // For manual triggers: IF the instance is destroyed THEN get out of here.
            if (opts.state.isDestroyed) {
                this._debug('INFO | Infinite Scroll instance was destroyed.');
                return false;
            }

            // IF behavior is defined AND this function is extended THEN call that instead of default.
            if (!!opts.behavior && this['retrieve_' + opts.behavior] !== undefined) {
                // Validate pageNum for over-ride function. its either a number or NULL.
                if (typeof(pageNum) == 'string') {
                    // Convert it to a number if its a string.
                    var page = parseInt(pageNum);
                    pageNum = isNaN(page) ? null : page;
                } else {
                    // If its not a number then unset it.
                    if (typeof(pageNum) !== 'number') {
                        pageNum = null;
                    }
                }

                this['retrieve_' + opts.behavior].call(this, pageNum);
                return true;
            }

            // We dont want to fire the ajax multiple times.
            opts.state.isDuringAjax = true;
            opts.callbacks.onBegin.call($(opts.contentSelector)[0], opts);
        },

        // Check to see if the next page is needed.
        scroll: function infscr_scroll() {
            var opts = this.options,
            state = opts.state;

            // IF behavior is defined AND this function is extended THEN call that instead of default.
            if (!!opts.behavior && this['scroll_' + opts.behavior] !== undefined) {
                this['scroll_' + opts.behavior].call(this);
                return;
            }

            if (state.isDuringAjax || state.isInvalidPage || state.isDone || state.isDestroyed || state.isPaused) {
                return;
            }

            if (!this._nearbottom()) {
                return;
            }

            this.retrieve();
        },


        // Toggle pause value.
        toggle: function infscr_toggle() {
            this._pausing();
        },

        // Unbind from scroll.
        unbind: function infscr_unbind() {
            this._binding(false);
        },

        // Update Infinite Scroll options.
        update: function infscr_options(key) {
            if ($.isPlainObject(key)) {
                this.options = $.extend(true, this.options, key);
            }
        }
    };


    /*
    ----------------------------
    Infinite Scroll function
    ----------------------------

    Borrowed logic from the following...

    jQuery UI
    - https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js

    jCarousel
    - https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

    Masonry
    - https://github.com/desandro/masonry/blob/master/jquery.masonry.js
    */
    $.fn.infinitescroll = function infscr_init(options, callback) {
        var thisCall = typeof options;

        switch (thisCall) {

            // method
            case 'string':
                var args = Array.prototype.slice.call(arguments, 1);

                this.each(function () {
                    var instance = $.data(this, 'infinitescroll');

                    if (!instance) {
                        // Error. Infinite Scroll is not setup yet.
                        //instance._debug('ERROR | Method [' + options + '] cannot be called until Infinite Scroll is setup.');
                        // return $.error('Method ' + options + ' cannot be called until Infinite Scroll is setup');
                        return false;
                    }

                    if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
                        // Error. No such method exists.
                        //instance._debug('ERROR | No method [' + options + '] exists for Infinite Scroll.');
                        // return $.error('No such method ' + options + ' for Infinite Scroll');
                        return false;
                    }

                    // Yeah! No errors!
                    instance[options].apply(instance, args);
                });
                break;

            // Create an instance of the Infinite Scroll object.
            case 'object':
                this.each(function () {
                    var instance = $.data(this, 'infinitescroll');

                    if (instance) {
                        // Update options of current instance.
                        instance.update(options);
                    } else {
                        // Initialize the new instance.
                        instance = new $.infinitescroll(options, callback, this);

                        // IF the instantiation failed THEN don't attach it.
                        if (!instance.failed) {
                            $.data(this, 'infinitescroll', instance);
                        }
                    }
                });
                break;
            
            default:
        }

        return this;
    };


    /*
     * smartscroll: debounced scroll event for jQuery *
     * https://github.com/lukeshumard/smartscroll
     * Based on smartresize by @louis_remi: https://github.com/lrbabe/jquery.smartresize.js *
     * Copyright 2011 Louis-Remi & Luke Shumard * Licensed under the MIT license. *
     */
    var event = $.event,
    scrollTimeout;

    event.special.smartscroll = {
        setup: function () {
            $(this).bind('scroll', event.special.smartscroll.handler);
        },
        teardown: function () {
            $(this).unbind('scroll', event.special.smartscroll.handler);
        },
        handler: function (event, execAsap) {
            // Save the context.
            var context = this,
            args = arguments;

            // Set the correct event type.
            event.type = 'smartscroll';

            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(function () {
                $(context).trigger('smartscroll', args);
            }, execAsap === 'execAsap' ? 0 : 100);
        }
    };

    $.fn.smartscroll = function (fn) {
        return fn ? this.on('smartscroll', fn) : this.trigger('smartscroll', ['execAsap']);
    };
}));
