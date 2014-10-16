// Navigation over the search list

(function($) {
	'use strict';
	
	var Autocomplete = $.fn.fc_autocomplete.Constructor;
	
	Autocomplete.prototype.highlightItem = function( $item ) {
		if ( !$item ) {
			$item = this.$activeItem;
		}
		$item.addClass( "i-hover" );
	};
		
	Autocomplete.prototype.dimItem = function( $item ) {
		if ( !$item ) {
			$item = this.$activeItem;
		}
		$item.removeClass( "i-hover" );
	};
	
	Autocomplete.prototype.showHideDeleteButton = function () {
		if ( $.trim( this.$input.val() ) === "" ) {
			this.$delete.hide();
		} else {
			this.$delete.show();
		}
	};
	
}( jQuery ));