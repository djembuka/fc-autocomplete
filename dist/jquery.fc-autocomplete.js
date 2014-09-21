/*! Foodclub autocomplete jquery plugin - v0.1.0 - 2014-09-21
* https://github.com/djembuka/fc-autocomplete
* Copyright (c) 2014 Tatiana; Licensed MIT */
(function($) {

  // Collection method.
  $.fn.fc_autocomplete = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.fc_autocomplete = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.fc_autocomplete.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.fc_autocomplete.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].fc_autocomplete = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));
