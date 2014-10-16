// Navigation over the search list

(function($) {
	'use strict';
	
	var Autocomplete = $.fn.fc_autocomplete.Constructor;
	
	Autocomplete.prototype.cyrillic = function() {
		var value;
		
		if ( /^[\u0400-\u04ff\s]*$/.test( this.$input.val() )) {
			return;
		}
		
		value = this.$input.val().substring( 0, this.$input.val().length-1 );
		this.$input.val( value );
		this.cyrillic();
	};
	
}( jQuery ));