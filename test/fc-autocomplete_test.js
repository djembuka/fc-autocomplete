(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('$.fn.fc_autocomplete');

  test('$.fn.fc_autocomplete', function() { 
    expect(3);
    ok( $.fn.fc_autocomplete !== "undefined", 'exists');
    ok( typeof $.fn.fc_autocomplete === "function", 'is function');
    ok( typeof $.fn.fc_autocomplete.Constructor === "function", 'Constructor exists');
  });
  
  module('fc_autocomplete plugin', {
    setup: function() {
      this.$elem = $( "#recipeSearch" );
      this.$elem.fc_autocomplete();
    },
    teardown: function() {
      this.$elem.fc_autocomplete( "destroy" );
    }
  });

  test('Build DOM', function() {
    expect(1);
    ok( this.$elem.data( "fc_autocomplete" ), "sets data" );
  });
  
  test( "Check default values", function() {
    expect(18); 
    var defaults = this.$elem.data( "fc_autocomplete" ).getDefaults();
    
    notEqual( defaults, undefined, "default values exist" );
    strictEqual( typeof defaults, "object", "defaults are object" );
    
    equal( typeof defaults.itemsNum, "object",
      "itemsNum is an object" );
    equal( defaults.itemsNum.recipes, 5,
      "itemsNum.recipes is equal to 5" );
    equal( defaults.itemsNum.dishes, 3,
      "itemsNum.dishes is equal to 3" );
    equal( defaults.itemsNum.ingredients, 3,
      "itemsNum.ingredients is equal to 3" );
    equal( defaults.itemsNum.cuisines, 3,
      "itemsNum.cuisines is equal to 3" );
    
    ok( defaults.blockTitles instanceof Array,
      "blockTitles is an array" );
    equal( defaults.blockTitles[0], "recipes",
      "blockTitles[0] is equal to recipes");
    equal( defaults.blockTitles[1], "dishes",
      "blockTitles[1] is equal to dishes");
    equal( defaults.blockTitles[2], "ingredients",
      "blockTitles[2] is equal to ingredients");
    equal( defaults.blockTitles[3], "cuisines",
      "blockTitles[3] is equal to cuisines");
    
    equal( defaults.itemClass, "b-rs__item",
      "itemClass is equal to b-rs__item" );
    equal( defaults.linkClass, "b-rs__item__link",
      "ilinkClass is equal to b-rs__item__link" );
    equal( defaults.headingClass, "b-rs__heading",
      "headingClass is equal to b-rs__heading" );
    equal( defaults.strClass, "b-rs-str",
      "istrClass is equal to b-rs-str" );
    equal( defaults.searchAllClass, "b-rs__search-all",
      "searchAllClass is equal to b-rs__search-all" );
    equal( defaults.itemTag, "li", "itemTag is equal to li" );
  });
  
  test( "Options getter", function() {
  expect(4);
  //Undefined option
  equal( this.$elem.fc_autocomplete( "undefinedOption" ), "",
    "Returns empty string when called with " +
    "undefined option's name as a parameter." );
  //Real option
  equal( this.$elem.fc_autocomplete( "itemTag" ), "li",
    "Returns option value when called with " +
    "option's name as a parameter." );
  //Option with an object as a value
  equal( typeof this.$elem.fc_autocomplete( "itemsNum" ), "object",
    "Returns an object when option's value is an object." );
  //Option with an array as a value
  ok( this.$elem.fc_autocomplete( "blockTitles" ) instanceof Array,
    "Returns an array when option's value is an array." );
  });
  
  test( "Options setter", function() { 
    expect(3);
    //Change existing option
    var $element = this.$elem.fc_autocomplete( "itemsTag", "a" );
    ok( $element instanceof $, "Options setter returns the element." );
    ok( this.$elem.fc_autocomplete( "itemsTag" ), "a",
      "Existing option is changed." );
    //Set new option
    this.$elem.fc_autocomplete( "newOption", "newOptionValue" );
    ok( this.$elem.fc_autocomplete( "newOption" ), "newOptionValue",
      "The new option is set." );
  });
  
  test( "Method invocation", function() {
    expect(3);
    var $element = this.$elem.fc_autocomplete( "destroy" );
    ok( $element instanceof $, "Method invocation returns the element." );
    ok( !this.$elem.data( "fc_autocomplete" ), "Destroy method was called." );
    this.$elem.fc_autocomplete();
    equal( this.$elem.fc_autocomplete( "undefinedMethod" ), "",
      "Undefined method was called." );
  });
  
  test( "Set options from init", function() {
    expect(2);
    equal( this.$elem.fc_autocomplete( "itemsNum" ).recipes, 5, "itemsNum is set" );
    equal( this.$elem.fc_autocomplete( "itemTag" ), "li", "itemTag is set" );
  });
	
	test( "Check default vars", function() {
		expect(8);
		var instance = this.$elem.data( "fc_autocomplete" );
		
		strictEqual( instance.enabled, true, "enabled is set" );
		ok( instance.$element instanceof $, "$element is a jQuery object" );
		equal( instance.$element[0].tagName, this.$elem[0].tagName, "$element tag is correct" );
		ok( instance.options instanceof Object, "options is an object" );
		ok( instance.$input instanceof $, "$input is a jQuery object" );
		equal( instance.$input[0].tagName, "INPUT", "$input is input" );
		equal( instance.$activeItem, instance.$input, "$activeItem is $input by default" );
		equal( instance.elemValue, "", "elemValue is an empty string in the setup" );
	});

	module( "Build html", {
		setup: function() {
			this.$elem = $( "#recipeSearch" );
      this.$elem.fc_autocomplete();
		},
		teardown: function() {
			this.$elem.fc_autocomplete( "destroy" );
		}
	});
	
	test( "Search list element", function() {
		expect(3);
		var instance = this.$elem.data( "fc_autocomplete" ),
				$searchList = this.$elem.find( "#recipe_search_list" );
		
		ok( $searchList.length, "Search list exists" );
		equal( $searchList.parent()[0].tagName,
			instance.$input.parent()[0].tagName, "Search list is sibling to $input" );
		equal( $searchList.children( "ul" ).length, 1, "Search list has UL inside" );
	});

	module( "Handle events", {
		setup: function() {
			this.$elem = $( "#recipeSearch" );
      this.$elem.fc_autocomplete();
		},
		teardown: function() {
			this.$elem.fc_autocomplete( "destroy" );
		}
	});
	
	test( "Check focus handler", function() {
		expect(1);
		var instance = this.$elem.data( "fc_autocomplete" );
		
		instance.$input.trigger( $.Event( "focus" ) );
		ok( instance.$input.hasClass( "i-focused" ), "Focus adds class i-focused" );
	});
	
	test( "Check blur handler", function() {
		expect(2);
		var instance = this.$elem.data( "fc_autocomplete" );
		
		instance.$input.trigger( $.Event( "blur" ) );
		ok( !instance.$input.hasClass( "i-focused" ), "Blur removes class i-focused" );
		ok( instance.$list.is( ":hidden" ), "List is hidden" );
	});

	module( "Init JSON data", {
		setup: function() {
			this.$elem = $( "#recipeSearch" );
      this.$elem.fc_autocomplete();
		},
		teardown: function() {
			this.$elem.fc_autocomplete( "destroy" );
		}
	});
	
	test( "init all data object", function() {
		expect(7);
		var instance = this.$elem.data( "fc_autocomplete" ),
				mockObj = {
					"array": [
						"some element",
						{
							"title": "\u0419"
						}
					],
					"title": "\u0451",
					"object": {
						"title": "Title with \u0439 \u0401",
						"array": [
							"78 ingredients",
							"spagetti",
							"risotto"
						]
					}
				};
		
		ok( instance.makeLowerEITitles instanceof Function, "makeLowerEITitles is a function" );
		
		instance.makeLowerEITitles( mockObj );
		ok( mockObj.array[1].lowerTitle, "obj -> arr -> obj, make lowerTitle" );
		equal( mockObj.array[1].lowerTitle, "\u0438", "Make it lower, replace \u0439" );
		
		ok( mockObj.lowerTitle, "obj, make lowerTitle" );
		equal( mockObj.lowerTitle, "\u0435", "Make it lower, replace \u0451" );
		
		ok( mockObj.object.lowerTitle, "obj -> obj, make lowerTitle" );
		equal( mockObj.object.lowerTitle, "title with \u0438 \u0435", "Make it lower, replace \u0439, \u0451" );
	});
	
	test( "Replace E, I and make lower", function() {
		expect(1);
		var instance = this.$elem.data( "fc_autocomplete" ),
				mockObj = {
					"title": "\u0419 \u0401",
					"object": {}
				};
		
		instance.lowerEI( mockObj );
		equal( mockObj.lowerTitle, "\u0438 \u0435", "All done." );
	});
	
	module( "UI", {
		setup: function() {
			this.$elem = $( "#recipeSearch" );
      this.$elem.fc_autocomplete();
		},
		teardown: function() {
			this.$elem.fc_autocomplete( "destroy" );
		}
	});
	
	test( "highlightItem", function() {
		expect(2);
		var instance = this.$elem.data( "fc_autocomplete" ),
				$li = $( '<li class="' + instance.options.itemClass + '"></li>' );
		
		instance.highlightItem();
		ok( instance.$input.hasClass( "i-hover" ), "Input highlighted by default." );
		
		instance.highlightItem( $li );
		ok( $li.hasClass( "i-hover" ), "List item highlighted." );
	});
	
	test( "dimItem", function() {
		expect(2);
		var instance = this.$elem.data( "fc_autocomplete" ),
				$li = $( '<li class="' + instance.options.itemClass + '"></li>' );
		
		instance.$input.addClass( "i-hover" );
		instance.dimItem();
		ok( !instance.$input.hasClass( "i-hover" ), "Input dimmed by default." );
		
		$li.addClass( "i-hover" );
		instance.dimItem( $li );
		ok( !$li.hasClass( "i-hover" ), "List item dimmed." );
	});
	
	test( "showHideDeleteButton", function() {
		expect(1);
		ok( this.$elem, "Test is needed." );
	});
	
	module( "Security", {
		setup: function() {
			this.$elem = $( "#recipeSearch" );
      this.$elem.fc_autocomplete();
		},
		teardown: function() {
			this.$elem.fc_autocomplete( "destroy" );
		}
	});
	
	test( "cyrillic", function() {
		expect(1);
		var instance = this.$elem.data( "fc_autocomplete" ),
				testString = "\u0401\u0444gh\04aa";
		
		instance.$input.val( testString );
		instance.cyrillic();
		equal( instance.$input.val(), "\u0401\u0444",
			"Value is cyrillified." );
	});
	
	test( "latinFree", function() {
		expect(1);
		var instance = this.$elem.data( "fc_autocomplete" ),
				testString = "\u0401\u0444gh\04aa",
				string = instance.latinFree( testString );
		
		equal( string, "\u0401\u0444",
			"Slice from beginning to the first latin symbol." );
	});
	
	module( "Search", {
		setup: function() {
			this.$elem = $( "#recipeSearch" );
      this.$elem.fc_autocomplete();
		},
		teardown: function() {
			this.$elem.fc_autocomplete( "destroy" );
		}
	});
	
	test( "appendImages", function() {
		expect(2);
		var instance = this.$elem.data( "fc_autocomplete" ),
				$img;
		
		instance.$list.append( '<div data-image="imgSrc"></div>' );
		instance.appendImages();
		$img = instance.$list.find( "img" );
		
		equal( $img.length, 1, "Append image" );
		equal( $img.attr( "src" ), "imgSrc", "The image has correct src" );
	});
	
	test( "getTimeFromMinutes", function() {
		expect(6);
		var instance = this.$elem.data( "fc_autocomplete" ),
				result;
		
		result = instance.getTimeFromMinutes( 1 );
		equal( result.hours, 0, "Calculate hours" );
		equal( result.minutes, 1, "Calculate minutes" );
		
		result = instance.getTimeFromMinutes( 84 );
		equal( result.hours, 1, "Calculate hours" );
		equal( result.minutes, 24, "Calculate minutes" );
		
		result = instance.getTimeFromMinutes( 156 );
		equal( result.hours, 2, "Calculate hours" );
		equal( result.minutes, 36, "Calculate minutes" );
	});
	
	test( "getIndex", function() {
		expect(1);
		ok( this.$elem, "All other tests are needed." );
	});
	
}(jQuery));
