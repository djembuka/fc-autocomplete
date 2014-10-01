// Build html

(function($) {
	'use strict';
	
	var Autocomplete = $.fn.fc_autocomplete.Constructor;
	
	Autocomplete.prototype.buildHtml = function() {
		this.$list = $( '<ul class="b-recipe-search__ul"></ul>' );
		this.$input
			.parent()
			.append( $( '<div id="recipe_search_list"></div>' )
									.append( this.$list ));
	};
	
}( jQuery ));