// Events handling

(function($) {
	'use strict';
	
	var Autocomplete = $.fn.fc_autocomplete.Constructor;
	
	Autocomplete.prototype.handleEvents = function() {
		this.$input
			.on( "focus", $.proxy( this.focus, this ))
			.on( "blur", $.proxy( this.blur, this ))
			.on( "keydown",  $.proxy( this.keydown, this ))
			.on( "keyup",  $.proxy( this.keyup, this ));
	};
	
	Autocomplete.prototype.focus = function() {
		this.$input.addClass( "i-focused" );
		this.getJSONData();		
	};
	
	Autocomplete.prototype.blur = function() {
		this.$input.removeClass( "i-focused" );
		this.$list.hide();
	};
	
	Autocomplete.prototype.keydown = function(e) {
		//to prevent situations when cursor jumps
		//to the first position of the string
		if ( e.ctrlKey || e.which === 38 || e.which === 40 ) {
			return false;
		}
	};
	
	Autocomplete.prototype.keyup = function(e) {
		switch ( e.which ) {
		
			case 38:
				this.navUp();
				break;
				
			case 40:
				this.navDown();
				break;
				
			case 13:
				this.pressEnter();
				break;
				
			default:
				this.showHideDeleteButton();
				this.cyrillic();
				this.search();
		}
	};
	
}( jQuery ));