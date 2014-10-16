// Navigation over the search list

(function($) {
	'use strict';
	
	var Autocomplete = $.fn.fc_autocomplete.Constructor;
	
	Autocomplete.prototype.pressEnter = function() {
		this.$button.click();
	};
	
}( jQuery ));