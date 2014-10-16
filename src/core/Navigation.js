// Navigation over the search list

(function($) {
	'use strict';
	
	var Autocomplete = $.fn.fc_autocomplete.Constructor;
	
	Autocomplete.prototype.navUp = function() {
		if ( this.$activeItem.is( this.$input )) {
			this.$activeItem = this.$list
				.find( this.options.itemTag + ":last" );
				
		} else {
			this.dimItem();
			this.$activeItem = this.$activeItem
				.prev( this.options.itemTag );
		}
		
		this.activeItemProcessing( this.navUp );
	};
	
	Autocomplete.prototype.navDown = function() {			
		if ( this.$activeItem.is( this.$input )) {
			this.$activeItem = this.$list
				.find( this.options.itemTag + ":first" );
		} else {
			this.dimItem();
			this.$activeItem = this.$activeItem
				.next( this.options.itemTag );
		}
		
		this.activeItemProcessing( this.navUp );
	};
	
	Autocomplete.prototype.activeItemProcessing =
	function( navFunction ) {
		var text;
		
		if ( !this.$activeItem.is( this.options.itemTag )) {
			this.$activeItem = this.$input;
			this.$input.val( this.elemValue );
			return;
			
		} else if ( this.$activeItem.is( "." +
			this.options.searchAllClass )) {
			
			this.$input.val( this.elemValue );
			this.highlightItem();
			return;
			
		} else if ( this.$activeItem.is( "." +
			this.options.headingClass )) {
			
			navFunction();
			return;
		}
		
		text = this.$activeItem.find( "." +
			this.options.strClass ).text();
		
		this.$input.val( text );
		this.highlightItem();
	};
	
}( jQuery ));