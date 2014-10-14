/*
 * fc-autocomplete
 * https://github.com/djembuka/fc-autocomplete
 *
 * Copyright (c) 2014 Tatiana
 * Licensed under the MIT license.
 */

(function($) {
  'use strict';
  
  // AUTOCOMPLETE PUBLIC CLASS DEFINITION
  // ===============================

  var Autocomplete = function ( element, options ) {
    this.options    =
    this.enabled    =
    this.$element   = null;

    this.init( element, options );
  };
  
  Autocomplete.DEFAULTS = {
    itemsNum : {
      recipes: 5,
      dishes: 3,
      ingredients: 3,
      cuisines: 3
    },
    blockTitles: [
      "recipes",
      "dishes",
      "ingredients",
      "cuisines"
    ],
    itemClass: "b-rs__item",
    linkClass: "b-rs__item__link",
    headingClass: "b-rs__heading",
    strClass: "b-rs-str",
    searchAllClass: "b-rs__search-all",
    itemTag: "li",
		foodclubJSON: undefined,
		foodclubJSONUrl: "/php/foodclubJSON.php"
  };
  
  Autocomplete.prototype.init = function ( element, options ) {
    this.enabled   = true;
    this.$element  = $( element );
    this.options = this.getOptions( options );
    this.$input = this.$element.find(".b-recipe-search__input");
    this.$activeItem = this.$input;// active list item (highlighted by keyboard arrows)
    this.elemValue = $.trim( this.$input.val() );
    //this.$delete = this.$elem.find(".b-recipe-search__delete");
    //this.$button = this.$elem.find(".b-recipe-search__button");
    // ! Create option for additional form elements like delete and send buttons.
		
		this.buildHtml();
		this.handleEvents();
  };

  Autocomplete.prototype.getDefaults = function () {
    return Autocomplete.DEFAULTS;
  };

  Autocomplete.prototype.getOptions = function (options) {
    options = $.extend( {}, this.getDefaults(), this.$element.data(), options );
    return options;
  };
  
  Autocomplete.prototype.getOption = function( option ) {
    return this.options[ option ];
  };
  
  Autocomplete.prototype.setOption = function( option, value ) {
  this.options[ option ] = value;
  };
  
  Autocomplete.prototype.destroy = function() {
  this.$element.off( ".fc_autocomplete" ).removeData( "fc_autocomplete" );
  };
  
  // AUTOCOMPLETE PLUGIN DEFINITION
  // =========================

  function Plugin( option, params ) {
  
		//If call the plugin for an option value
		var result;
		
		if ( typeof option === 'string' ) {
			this.each( function() {
				var $this = $( this ),
					data = $this.data( "fc_autocomplete" );
				
				if ( !data ) {
					return;
				}
				
				if ( typeof data[option] === "function" ) {
					data[ option ]( params );
				
				} else if ( params ) {
					data.setOption( option, params );
				
				} else {
					result = data.getOption( option ) || "";
				}      
			});
			
			if ( result || result === "" ) {
				return result;
			}
			
			return this;
		}
		
		//If call for method or a new instance
    return this.each( function () {
      var $this   = $( this ),
					data    = $this.data( 'fc_autocomplete' ),
					options = typeof option === 'object' && option;
    
      if ( !data ) {
        $this.data( 'fc_autocomplete',
          ( data = new Autocomplete( this, options ) ));
      }
    });
  }

  var old = $.fn.fc_autocomplete;

  $.fn.fc_autocomplete             = Plugin;
  $.fn.fc_autocomplete.Constructor = Autocomplete;


  // AUTOCOMPLETE NO CONFLICT
  // ===================

  $.fn.fc_autocomplete.noConflict = function () {
    $.fn.fc_autocomplete = old;
    return this;
  };

}( jQuery ));
