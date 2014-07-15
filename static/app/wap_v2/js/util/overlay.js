/*
 * jQuery Simple Overlay
 * A jQuery Plugin for creating a simple, customizable overlay. Supports multiple instances,
 * custom callbacks, hide on click, glossy effect, and more.
 *
 * Copyright 2011 Tom McFarlin, http://tommcfarlin.com, @moretom
 * Released under the MIT License
 *
 * http://moreco.de/jquery-simple-overlay
 */
var zepto = require('zepto');

(function($) {

	$.fn.overlay = function(options) {

    var opts = $.extend({}, $.fn.overlay.defaults, options);
		return this.each(function(evt) {
      if(!$(this).hasClass('overlay-trigger')) {
        show(create($(this), opts), opts);
      }
		});
    
	}; // end overlay

  /*--------------------------------------------------*
   * helper functions
   *--------------------------------------------------*/
  
  /**
   * Creates the overlay element, applies the styles as specified in the 
   * options, and sets up the event handlers for closing the overlay.
   *
   * opts The plugin's array options.
   */
  function create($src, opts) {
  
    // prevents adding multiple overlays to a container
    $src.addClass('overlay-trigger');
  
    // create the overlay and add it to the dom
    var overlay = $('<div></div>')
      .addClass('overlay')
      .css({
        background: opts.color,
        opacity: opts.opacity,
        top: 0,
        left: $(opts.container).offset().left,
        width: opts.container === 'body' ? '100%' : $(opts.container).width(),
        height: opts.container === 'body' ? '100%' : $(opts.container).height(),
        position: 'fixed',
        zIndex: 1000,
        display: 'none',
        overflow: 'hidden'
      });

    // if specified, apply the gloss
    if(opts.glossy) {
      applyGloss(opts, overlay);     
    } // end if
    
    // setup the event handlers for closing the overlay
    if(opts.closeOnClick) {
      $(overlay).click(function() {
        close(overlay, opts);
        $src.removeClass('overlay-trigger');
      });
    } // end if
    
    if(opts.closeBtn) {
        $('body').delegate(opts.closeBtn, "click",function(){
            close(overlay, opts);
            $src.removeClass('overlay-trigger');
        });
    }
    // finally add the overlay
    $(opts.container).append(overlay);
   
    return overlay;
    
  } // end createOverlay
  
  /**
   * Displays the overlay using the effect specified in the options. Optionally
   * triggers the onShow callback function.
   *
   * opts The plugin's array options.
   */
  function show(overlay, opts) {
    if(opts.onShow) {
        opts.onShow();
    }
    $(overlay).show();
  } // end show
  
  /**
   * Hides the overlay using the effect specified in the options. Optionally
   * triggers the onHide callback function.
   *
   * opts The plugin's array options.
   */
  function close(overlay, opts) {
    
    $(overlay).hide();
    if(opts.onHide) {
      opts.onHide();
    }
    $(overlay).remove();
  } // end close
  
  /**
   * Adds the gloss effect to the overlay.
   *
   * opts     The plugin's options array
   * overlay  The overlay on which the gloss will be applied
   */
  function applyGloss(opts, overlay) {
  
    var gloss = $('<div></div>');
    $(gloss).css({
      background: '#fff',
      opacity: 0.2,
      width: '200%',
      height: '100%',
      position: 'absolute',
      zIndex: 1001,
      msTransform: 'rotate(45deg)',
      webkitTransform: 'rotate(45deg)',
      oTransform: 'rotate(45deg)'
    });
      
    // at the time of development, mozTransform didn't work with >= jQuery 1.5
    if($.browser.mozilla) {
     $(gloss).css('-moz-transform', 'rotate(45deg');
    } // end if
     
    $(overlay).append(gloss);
    
  } // end applyGloss
 
  /*--------------------------------------------------*
   * default settings
   *--------------------------------------------------*/
   
	$.fn.overlay.defaults = {
    color: '#000',
    opacity: 0.5,
    effect: 'none',
    onShow: null,
    onHide: null,
    closeOnClick: false,
    closeBtn:null,
    glossy: false,
    container: 'body'
	}; // end defaults

})(zepto);