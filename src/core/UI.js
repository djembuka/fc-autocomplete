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
	
	Autocomplete.prototype.showHideDeleteButton = function() {
		if ( $.trim( this.$input.val() ) === "" ) {
			this.$delete.hide();
		} else {
			this.$delete.show();
		}
	};
	
	Autocomplete.prototype.tmpl = function( str ) {
		var tmpl, func;
		tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
			'with(obj||{}){__p.push(\'' +
			str.replace(/\\/g, '\\\\')
       .replace(/'/g, "\\'")
       .replace(/<%-([\s\S]+?)%>/g, function(match, code) {
         return "',esc(" + code.replace(/\\'/g, "'") + "),'";
       })
       .replace(/<%=([\s\S]+?)%>/g, function(match, code) {
         return "'," + code.replace(/\\'/g, "'") + ",'";
       })
       .replace(/<%([\s\S]+?)%>/g, function(match, code) {
         return "');" + code.replace(/\\'/g, "'")
                            .replace(/[\r\n\t]/g, ' ') + ";__p.push('";
       })
       .replace(/\r/g, '\\r')
       .replace(/\n/g, '\\n')
       .replace(/\t/g, '\\t') +
       "');}return __p.join('');";
	
		func = new Function( 'obj', tmpl );
		
		return function( data ) {
			return func.call( this, data );
		};
	};
	
}( jQuery ));