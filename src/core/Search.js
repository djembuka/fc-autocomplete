// Navigation over the search list

(function($) {
	'use strict';
	
	var Autocomplete = $.fn.fc_autocomplete.Constructor;
	
	Autocomplete.prototype.search = function() {
		var result = [];
		
		if ( this.options.loadImageTimeoutId ) {
			clearTimeout( this.options.loadImageTimeoutId );
		}

		this.elemValue = this.$input.val();
		this.$list.empty();
		
		if ( $.trim( this.elemValue ) === "" ) {
			this.hideList();
			return;
		}
		
		this.searchString = this.elemValue
								.toLowerCase()
								.replace( "\u0451", "\u0435" )
								.replace( "\u0439", "\u0438" )
								.split( " " );

		
		this.formBlocks( result );

		this.checkKeyboardLayout( result );
		
		this.$list
			.append( '<li class="b-rs__search-all"><a href="/search/' + this.$input.val() + '/" class="b-rs__search-all__link">\u0412\u0441\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B</a></li>' )
			.show();
	};
	
	Autocomplete.prototype.formBlocks = function( result ) {
		var i;
		for ( i = 0; i < this.options.blockTitles.length; i++ ) {
			result[i] = this.getSortedItems( this.foodclubJSON[ this.options.blockTitles[i] ] );
			this.addListBlock( result[i], this.options.blockTitles[i] );
		}
	};
	
	Autocomplete.prototype.checkKeyboardLayout = function( result ) {
		if ( result.join( "" )) {
			return;
		}

		this.searchString = this.changeLayout( this.searchString );
		this.searchString = this.searchString
			.toLowerCase()
			.split( " " );

		this.formBlocks();
	};
	
	Autocomplete.prototype.getSortedItems = function( searchObject ) {
		var sortedArray;
		
		searchObject.items.sort( this.sortItems );//sorted from 0 to max position, then without substring (-1 position)
			
		if ( searchObject.items[0].index === -1 ) {
			sortedArray = [];
		} else {
			sortedArray = this.getSortedByRecursion( searchObject.items );
			this.highlightSubstring( sortedArray );
		}
		
		return sortedArray;
	};
	
	Autocomplete.prototype.highlightSubstring = function( sortedArray ) {
		var i, start, substr;
		for ( i = 0; i < sortedArray.length; i++ ) {
			start = sortedArray[i].lowerTitle.indexOf( this.searchString[0] );					
			substr = sortedArray[i].title.substr( start, this.searchString[0].length );
			
			sortedArray[i].highlightedTitle =
				sortedArray[i].title.replace( substr, '<b>' + substr + '</b>' );
		}
	};
	
	Autocomplete.prototype.sortItems = function( a, b ) {
		var i;
		
		a.index = Infinity;
		b.index = Infinity;
		
		for ( i = 0; i < this.searchString.length; i++ ) {
			a.index = Math.min( a.index, a.lowerTitle.indexOf( this.searchString[i] ));
			b.index = Math.min( b.index, b.lowerTitle.indexOf( this.searchString[i] ));
		}
		
		if ( a.index < b.index && a.index !== -1 ) {
			return -1;
		}
		if ( a.index > b.index && b.index !== -1 ) {
			return 1;
		}
		
		if ( a.index === -1 ) {
			return 1;
		}
		if ( b.index === -1 ) {
			return -1;
		}
		
		//a.index = b.index != -1
		if ( a.lowerTitle < b.lowerTitle ) {
			return -1;
		}
		if ( a.lowerTitle > b.lowerTitle ) {
			return 1;
		}
		
		return 0;
	};
	
	Autocomplete.prototype.getSortedByRecursion = function( array ) {
		var index = this.getIndex( [ 0, array.length-1 ], array );
		return array.slice( 0, index );
	};
	
	Autocomplete.prototype.getIndex = function( borders, array ) {
		var centerIndex = Math.ceil( borders[0] + ( borders[1] - borders[0] )/2 );
		
		if ( array[ centerIndex ].index === -1 ) {
		
			if ( centerIndex === borders[1] ) {
				return borders[1];
			}
			return this.getIndex( [borders[0], centerIndex] );
			
		} else {
		
			if ( centerIndex === borders[1] ) {
				return borders[1] + 1;
			}
			return this.getIndex( [centerIndex, borders[1]] );
			
		}
	};
	
	Autocomplete.prototype.addListBlock = function( array, dataType ) {
		if ( array.length === 0 ) {
			return;
		}
		
		this.makeHeading( array, dataType );
		this.makeItems( array, dataType );
	};
	
	Autocomplete.prototype.makeHeading = function( array, dataType ) {
		var num = "";
		
		if ( array.length > this.options.itemsNum[ dataType ]) {
			num = '<span class="' + this.options.headingClass +
				'__num"><span class="' + this.options.headingClass +
				'__num__content">' + this.options.itemsNum[ dataType ] +
				' \u0438\u0437 ' + array.length + '</span></span>';
		}
		
		this.$list.append( '<li class="' + this.options.headingClass + '">' +
		num + this.foodclubJSON[ dataType ].title + '</li>');
	};
	
	Autocomplete.prototype.makeItems = function( array, dataType ) {
		var i, href, time, $item;
		
		for ( i = 0; i < this.options.itemsNum[ dataType ]; i++) {
			if ( !array[i] ) {
				continue;
			}
			
			href = this.foodclubJSON[ dataType ].url.replace( "$&", array[i].id );
			time = this.getTimeFromMinutes( array[i].time );
			
			$item = this.getItem({
				url: href,
				image: array[i].image,
				title: array[i].highlightedTitle,
				time: time,
				nutrition: array[i].nutrition
			});
			
			this.$list.append( $item );
			this.loadImageTimeoutId = setTimeout( this.appendImages, 200 );					
		}
	};
	
	Autocomplete.prototype.getTimeFromMinutes = function( minutes ) {
		var time = {};
		time.hours = Math.floor( minutes / 60 );
		time.minutes = minutes % 60;
		
		return time;
	};
	
	Autocomplete.prototype.getItem = function( obj ) {
		var template = document.getElementById( 'recipe_search_items' ).innerHTML,
			compiled = this.tmpl(template),
			result = $( compiled(obj) );
		
		return result;
	};
	
	Autocomplete.prototype.appendImages = function() {
		this.$list.find( "[data-image]" ).each( function() {
			var $this = $( this );
			$this.append( '<img src="' + $this.attr( "data-image" ) +
			'" width="50" height="50" alt="" class="b-rs__item__image"' +
			' onload="onloadRecipeSearchImage(this);">' );
		});
	};
	
}( jQuery ));