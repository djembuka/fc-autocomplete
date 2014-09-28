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

}(jQuery));
