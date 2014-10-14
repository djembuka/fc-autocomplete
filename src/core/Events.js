// Events handling

(function($) {
	'use strict';
	
	var Autocomplete = $.fn.fc_autocomplete.Constructor;
	
	Autocomplete.prototype.handleEvents = function() {
		this.$input
			.on( "focus", $.proxy( this.focus, this ))
			.on( "blur", $.proxy( this.blur, this ))
			.on( "keydown",  this.keydown )
			.on( "keyup",  this.keyup );
	};
	
	Autocomplete.prototype.focus = function() {
		this.$input.addClass( "i-focused" );
		this.getJSONData();		
	};
	
	Autocomplete.prototype.blur = function() {
		this.$list.hide();
	};
	
}( jQuery ));