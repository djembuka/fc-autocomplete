// Init JSON data

(function($) {
	'use strict';
	
	var Autocomplete = $.fn.fc_autocomplete.Constructor;
	
	Autocomplete.prototype.getJSONData = function() {
		var self = this;
		
		if ( this.options.foodclubJSON ) {
			return;
		}
		
		$.ajax({
			url: self.options.foodclubJSONUrl,
			type: "POST",
			error: function( a, b, c ) {
				if ( window.console ) {
					window.console.log(a);
					window.console.log(b);
					window.console.log(c);
				}
			},
			success: function( data ) {
				self.options.foodclubJSON = $.parseJSON( data );
				self.initJSONData();
			}
		});
	};

	Autocomplete.prototype.initJSONData = function() {
		this.makeLowerEITitles( this.options.foodclubJSON );
	};
	
	Autocomplete.prototype.makeLowerEITitles = function( json ) {
		var key,
				self = this;
			
		if ( json instanceof Array ) {
			json.forEach( function( elem ) {
				self.makeLowerEITitles( elem );
			});
		} else if ( json instanceof Object ) {
			if ( json.hasOwnProperty( "title" )) {
				this.lowerEI( json );
			}
			for ( key in json ) {
				if (( json.hasOwnProperty( key ) && json[key] instanceof Object ) ||
						( json.hasOwnProperty( key ) && json[key] instanceof Array )) {
					this.makeLowerEITitles( json[key] );
				}
			}
		}
	};
	
	Autocomplete.prototype.lowerEI = function( obj ) {
		obj.lowerTitle = obj.title
											.toLowerCase()
											.replace("\u0451", "\u0435")
											.replace("\u0439", "\u0438");
	};
	
}( jQuery ));