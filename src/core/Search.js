// Navigation over the search list

(function($) {
	'use strict';
	
	var Autocomplete = $.fn.fc_autocomplete.Constructor;
	
	Autocomplete.prototype.search = function() {};
	
	function search() {
		if ( self.loadImageTimeoutId ) clearTimeout( self.loadImageTimeoutId );

		self.elemValue = self.$input.val();
		self.$list.empty();
		
		if ( $.trim( self.elemValue ) == "" ) {
			hideList();
			return;
		}
		
		self.searchString = self.elemValue
								.toLowerCase()
								.replace("ё", "е")
								.replace("й", "и")
								.split(" ");

		var result = [];
		formBlocks();

		checkKeyboardLayout();
		
		self.$list
			.append('<li class="b-rs__search-all"><a href="/search/' + self.$input.val() + '/" class="b-rs__search-all__link">Все результаты</a></li>')
			.show();

		function formBlocks() {
			for(var i = 0; i < self.options.blockTitles.length; i++) {
				result[i] = getSortedItems(foodclubJSON[self.options.blockTitles[i]]);
				addListBlock(result[i], self.options.blockTitles[i]);
			}
		}

		function checkKeyboardLayout() {
			if(result.join("")) return;

			self.searchString = changeLayout(self.searchString);
			self.searchString = self.searchString
								.toLowerCase()
								.split(" ");

			formBlocks();
		}
		
		function getSortedItems(searchObject) {//substring hightlight is needed
			searchObject.items.sort(sortItems);//sorted from 0 to max position, then without substring (-1 position)
			
			if(searchObject.items[0].index == -1) {
				var sortedArray = [];
			} else {
				var sortedArray = getSortedByRecursion(searchObject.items);
				highlightSubstring(sortedArray);
			}
			
			return sortedArray;
			
			function highlightSubstring(sortedArray) {
				for(var i = 0; i < sortedArray.length; i++) {
					var start = sortedArray[i].lowerTitle.indexOf(self.searchString[0]);					
					var substr = sortedArray[i].title.substr(start, self.searchString[0].length);
					
					sortedArray[i].highlightedTitle = sortedArray[i].title.replace(substr, '<b>' + substr + '</b>');
				}
				
			}
			
			function sortItems(a, b) {
				a.index = Infinity;
				b.index = Infinity;
				
				for(var i = 0; i < self.searchString.length; i++) {
					a.index = Math.min(a.index, a.lowerTitle.indexOf(self.searchString[i]));
					b.index = Math.min(b.index, b.lowerTitle.indexOf(self.searchString[i]));
				}
				
				if(a.index < b.index && a.index != -1)
					return -1;
				if(a.index > b.index && b.index != -1)
					return 1;
				
				if(a.index == -1)
					return 1;
				if(b.index == -1)
					return -1;
				
				//a.index = b.index != -1
				if(a.lowerTitle < b.lowerTitle)
					return -1;
				if(a.lowerTitle > b.lowerTitle)
					return 1;
				
				return 0;
			}
			
			function getSortedByRecursion(array) {
				var index = getIndex([0, array.length-1]);
				return array.slice(0, index);
				
				function getIndex(borders) {
					var centerIndex = Math.ceil(borders[0] + (borders[1] - borders[0])/2);
					
					if(array[centerIndex].index == -1) {
						if(centerIndex == borders[1]) return borders[1];
						return getIndex([borders[0], centerIndex]);
					} else {
						if(centerIndex == borders[1]) return borders[1]+1;
						return getIndex([centerIndex, borders[1]]);
					}
				}
				
			}
		}
		
		function addListBlock(array, dataType) {
			if (array.length == 0) return;
			
			makeHeading();
			makeItems();
			
			function makeHeading() {
				var num = "";
				if (array.length > self.options.itemsNum[dataType]) {
					num = '<span class="' + self.options.headingClass + '__num"><span class="' + self.options.headingClass + '__num__content">' + self.options.itemsNum[dataType] + ' из ' + array.length + '</span></span>';
				}
				self.$list.append('<li class="' + self.options.headingClass + '">' + num + window.foodclubJSON[dataType].title + '</li>');
			}
			
			function makeItems() {
				for (var i = 0; i < self.options.itemsNum[dataType]; i++) {
					if(!array[i]) continue;
					
					var href = window.foodclubJSON[dataType].url.replace("$&", array[i].id);
					
					var time = getTimeFromMinutes(array[i].time);
					
					var $item = getItem({
						url: href,
						image: array[i].image,
						title: array[i].highlightedTitle,
						time: time,
						nutrition: array[i].nutrition
					});
					
					self.$list.append($item);
					self.loadImageTimeoutId = setTimeout(appendImages, 200);					
				}
			}
			
			function getTimeFromMinutes(minutes) {
				var time = {};
				time.hours = Math.floor(minutes / 60);
				time.minutes = minutes % 60;
				
				return time;
			}
			
			function getItem(obj) {
				var template = document.getElementById('recipe_search_items').innerHTML;
				var compiled = tmpl(template);
				
				return $(compiled(obj));
			}

			function appendImages() {
				self.$list.find("[data-image]").each(function() {
					var $this = $(this);
					$this.append('<img src="' + $this.attr("data-image") + '" width="50" height="50" alt="" class="b-rs__item__image" onload="onloadRecipeSearchImage(this);">')
				});
			}
		}

	}
	
}( jQuery ));