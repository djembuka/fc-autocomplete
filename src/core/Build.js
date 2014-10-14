// Build html

(function($) {
	'use strict';
	
	var Autocomplete = $.fn.fc_autocomplete.Constructor;
	
	Autocomplete.prototype.buildHtml = function() {
		this.$input.after( $( '<div id="recipe_search_list">' +
		'<ul class="b-recipe-search__ul"></ul></div>' ));
		this.$list = this.$input.parent().find( ".b-recipe-search__ul" );
	};
	
}( jQuery ));