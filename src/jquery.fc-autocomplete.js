/*
 * fc-autocomplete
 * https://github.com/djembuka/fc-autocomplete
 *
 * Copyright (c) 2014 Tatiana
 * Licensed under the MIT license.
 */

(function($) {

  // Collection method.
  $.fn.fc_autocomplete = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

}(jQuery));
