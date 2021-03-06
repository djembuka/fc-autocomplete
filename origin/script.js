$(document).ready(function() {
	new FcRecipeSearch();

	$("[data-placeholder]").placeholder();
});

function FcRecipeSearch(params) {
	var self = this;
	
	init();
	
	function init() {
		initOptions();
		initVariables();
		makeHtml();
		handleEvents();

		showHideDeleteButton();
	}
	
	function initOptions() {
		self.options = params || {};
		self.options.itemsNum = self.options.itemsNum || {"recipes": 5, "dishes": 3, "ingredients": 3, "cuisines": 3};//number of items in each list
		self.options.blockTitles = self.options.blockTitles || ["recipes", "dishes", "ingredients", "cuisines"];
		self.options.itemClass = self.options.itemClass || "b-rs__item";
		self.options.linkClass = self.options.linkClass || "b-rs__item__link";
		self.options.headingClass = self.options.headingClass || "b-rs__heading";
		self.options.strClass = self.options.strClass || "b-rs-str";
		self.options.searchAllClass = self.options.searchAllClass || "b-rs__search-all";
		self.options.itemTag = self.options.itemTag || "li";
	}
	
	function initVariables() {
		self.$elem = $("#recipeSearch");
		self.$input = self.$elem.find(".b-recipe-search__input");
		self.$activeItem = self.$input;//active list item (highlighted by keyboard arrows)
		self.elemValue = $.trim(self.$input.val());
		self.$delete = self.$elem.find(".b-recipe-search__delete");
		self.$button = self.$elem.find(".b-recipe-search__button");
	}
	
	function makeHtml() {
		self.$list = $('<ul class="b-recipe-search__ul"></ul>');
		self.$input.parent().append($('<div id="recipe_search_list"></div>').append(self.$list));
	}
	
	function handleEvents() {
		self.$input
			.focus(focusInput)
			.keydown(keydownInput)
			.keyup(keyupInput);
		
		$(document).bind("click", clickDocument);
		self.$list.click(clickList);
		self.$delete.click(clickDelete);
		self.$button.click(clickButton);
		
		function clickDocument() {
			self.$list.hide();
		}
		
		function clickList(e) {
			e.stopPropagation();
		}
		
		function clickButton(e) {
			if(self.elemValue) {
				if (self.$activeItem.is("." + self.options.itemClass)) {//if item - follow the link
					window.location.href = self.$activeItem.find("." + self.options.linkClass).attr("href");
				} else {//if input or search-all element - use search engine
					window.location.href = self.$elem.find("form").attr("action") + self.elemValue + "/";
				}
			}
			
			e.preventDefault();
			return false;
		}
		
		function clickDelete() {
			self.elemValue = "";
			self.$input
				.val(self.elemValue)
				.focus();
			
			hideList();
			showHideDeleteButton();
			
			return false;
		}
		
		function keydownInput(e) {//to prevent situations when cursor jumps to the first position of the string
			if(e.ctrlKey) return false;

			switch (e.which) {
				case 38:
					return false;
					break;
				case 40:
					return false;
					break;
			}
		}
	
		function keyupInput(e) {
			switch (e.which) {
				case 38:
					navUp();
					break;
				case 40:
					navDown();
					break;
				case 13:
					pressEnter();
					break;
				default:
					showHideDeleteButton();
					cyrillic();
					search();
			}
		}
		
		function pressEnter() {
			self.$button.click();
		}
		
		function navUp() {
			if (self.$activeItem.is(self.$input)) {
				self.$activeItem = self.$list.find(self.options.itemTag + ":last");
			} else {
				delightItem();
				self.$activeItem = self.$activeItem.prev(self.options.itemTag);
			}
			
			activeItemProcessing(navUp);
		}
		
		function navDown() {
			if (self.$activeItem.is(self.$input)) {
				self.$activeItem = self.$list.find(self.options.itemTag + ":first");
			} else {
				delightItem();
				self.$activeItem = self.$activeItem.next(self.options.itemTag);
			}
			
			activeItemProcessing(navDown);
		}
		
		function activeItemProcessing(navFunction) {
			if(!self.$activeItem.is(self.options.itemTag)) {
				self.$activeItem = self.$input;
				self.$input.val(self.elemValue);
				return;
				
			} else if(self.$activeItem.is("." + self.options.searchAllClass)) {
				self.$input.val(self.elemValue);
				highlightItem();
				return;
				
			} else if(self.$activeItem.is("." + self.options.headingClass)) {
				navFunction();
				return;
				
			}
			
			var text = self.$activeItem.find("." + self.options.strClass).text();
			self.$input.val(text);
			highlightItem();
		}
		
		function highlightItem($item) {
			var $item = $item || self.$activeItem;
			$item.addClass("i-hover");
		}
		
		function delightItem($item) {
			var $item = $item || self.$activeItem;
			$item.removeClass("i-hover");
		}
		
		function focusInput() {
			downloadFoodclubJSON();
			
			function downloadFoodclubJSON() {
				if(window.foodclubJSON) return;
				
				$.ajax({
					url: "/php/foodclubJSON.php",
					type: "POST",
					error: ajaxError,
					success: function(data) {
						window.foodclubJSON = $.parseJSON(data);
						initJSON();
					}
				});
			}
	
			function initJSON() {
				makeLowerEITitles(foodclubJSON);
				
				function makeLowerEITitles(json) {
					if(typeof json == "object") {
						for(var key in json) {
							if(json[key] && json[key].title) {
								lowerEI(json[key]);
							}
							if(typeof json[key] == "object" || typeof json[key] == "array") {
								makeLowerEITitles(json[key]);
							}
						}
					} else if(typeof json == "array") {
						for(var i = 0; i < json.length; i++) {
							makeLowerEITitles(json[i]);
						}
					}
				}
				
				function lowerEI(obj) {
					obj.lowerTitle = obj.title.toLowerCase().replace("ё", "е").replace("й", "и");
				}
			}
		}
	}
	
	function cyrillic() {
		if(/^[\u0400-\u04ff\s]*$/.test(self.$input.val())) return;
		
		self.$input.val(self.$input.val().substring(0, self.$input.val().length-1));
		cyrillic(self.$input);
	}
	
	function hideList() {
		self.$list
			.empty()
			.hide();
	}

	function showHideDeleteButton() {
		if($.trim(self.$input.val()) == "") {
			self.$delete.hide();
		} else {
			self.$delete.show();
		}
	}
	
	function search() {
		if(self.loadImageTimeoutId) clearTimeout(self.loadImageTimeoutId);

		self.elemValue = self.$input.val();
		self.$list.empty();
		
		if($.trim(self.elemValue) == "") {
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

	function changeLayout(text) {
		for(var i = 0, result = "", letter; i < String(text).length; i++) {
			letter = String(text).substr(i, 1);

			for(var j = 0; j < layoutTable.length; j++) {
				if(layoutTable[j][letter]) result += layoutTable[j][letter];
			}
			
		}

		return result;
	}

	layoutTable = [
		{
			"a": "ф",
			"b": "и",
			"c": "с",
			"d": "в",
			"e": "у",
			"f": "а",
			"g": "п",
			"h": "р",
			"i": "ш",
			"j": "о",
			"k": "л",
			"l": "д",
			"m": "ь",
			"n": "т",
			"o": "щ",
			"p": "з",
			"q": "й",
			"r": "к",
			"s": "ы",
			"t": "е",
			"u": "г",
			"v": "м",
			"w": "ц",
			"x": "ч",
			"y": "н",
			"z": "я"
		},
		{
			"а": "f",
			"б": ",",
			"в": "d",
			"г": "u",
			"д": "l",
			"е": "t",
			"ё": "`",
			"ж": ";",
			"з": "p",
			"и": "b",
			"й": "q",
			"к": "r",
			"л": "k",
			"м": "v",
			"н": "y",
			"о": "j",
			"п": "g",
			"р": "h",
			"с": "c",
			"т": "n",
			"у": "e",
			"ф": "a",
			"х": "[",
			"ц": "w",
			"ч": "x",
			"ш": "i",
			"щ": "o",
			"ъ": "]",
			"ы": "s",
			"ь": "m",
			"э": "'",
			"ю": ".",
			"я": "z"
		}
	];
}

//--placeholder--//
(function($) {
	var defaults = {
		//text:"",
		//color:"#aaaaaa"
	};
	$.fn.placeholder = function(params) {
		
		var options = $.extend({}, defaults, params);
		
		$(this).each(function() {
			
			var self = this;
			self.$elem = $(this),
			self.$formField = self.$elem.closest(".b-form-field");
			self.placeholderText = options.text || self.$elem.attr("data-placeholder");
			
			init();
			
			function init() {
				if(!self.$placeholder) {
					createPlaceholder();
				}
				turnOn();
				handleEvents();
			}
			
			function turnOn() {
				setTimeout(function() {//for chrome, for it fills the password field in some time after loading the page
					if(self.$elem.val() == "") {
						self.$formField.addClass("i-placeholder");
					}
				}, 10);
			}
			
			function handleEvents() {
				self.$placeholderText.click(function() {
					self.$elem.focus();
				});
				
				self.$elem
					.focus(function() {
						onFocus();
					})
					.blur(function() {
						onBlur();
					});
				
			}
			
			function createPlaceholder() {
				self.$placeholder = $('<div class="b-form-field__placeholder"><div class="b-form-field__placeholder__text">' + self.placeholderText + '</div></div>');
				self.$placeholderText = self.$placeholder.find(".b-form-field__placeholder__text");
				
				self.$elem.before(self.$placeholder);
				
				setPlaceholderSize();
			}
			
			function setPlaceholderSize() {
				if(self.$elem.is(":visible")) {
					setSize();
				}
				else {
					var $elem = self.$elem;
					var $parent = $elem.parent();
					$elem.css({position: "absolute", bottom: "0", left: "0"}).appendTo("body");
					setSize();
					$parent.append($elem);
					$elem.css({position: "static", bottom: "none", left: "none"});
				}
				
				function setSize() {
					self.$placeholderText
						.css(
							{
								width: self.$elem.outerWidth() - parseInt(self.$placeholderText.css("paddingLeft")) + "px",
								height: self.$elem.outerHeight() - parseInt(self.$placeholderText.css("paddingTop")) + "px"
							}
						);
				}
			}
			
			function onFocus() {
				self.$formField.removeClass("i-placeholder");
			}
			
			function onBlur() {
				if (self.$elem.val() == "") {
					self.$formField.addClass("i-placeholder");
				}
			}
			
		});
		return this;
	};
})(jQuery);

function onloadRecipeSearchImage(elem) {
	setImageSize();
	showImage();

	function showImage() {
		elem.style.display = "inline-block";
	}

	function setImageSize() {
		var needed = {
			width: 50,
			height: 50
		};

		var img = new Image();
		img.src = elem.getAttribute("src");
		var width = img.width;
		var height = img.height;

		if(width > height) {
			width = width * needed.height / height;
			height = needed.height;
			var marginLeft = -1 * Math.round((width - needed.width) / 2);
			elem.style.marginLeft = marginLeft + "px";

		} else if(height > width) {
			height = height * needed.width / width;
			width = needed.width;
			var marginTop = -1 * Math.round((height - needed.height) / 2);
			elem.style.marginTop = marginTop + "px";

		} else {
			width = needed.width;
			height = needed.height;

		}

		elem.setAttribute("width", Math.round(width));
		elem.setAttribute("height", Math.round(height));
	}
	
}
