// Navigation over the search list

(function($) {
	'use strict';
	
	var Autocomplete = $.fn.fc_autocomplete.Constructor;
	
	Autocomplete.prototype.cyrillic = function() {
		this.$input.val( this.latinFree( this.$input.val() ) );
	};
	
	Autocomplete.prototype.latinFree = function( value ) {
		value = String( value );
		
		if ( /^[\u0400-\u04ff\s]*$/.test( value )) {
			return value;
		}
		
		return this.latinFree( value.slice( 0, -1 ) );
	};
	
}( jQuery ));