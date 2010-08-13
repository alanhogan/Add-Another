// AddAnother jQuery Plugin by Jeremy Lindblom. Based on relCopy by Andres Vidal.
(function($) {
	
	var regexSingleBrackets = /\[0?\]+$/;
	var regexDoubleBrackets = /\[0\]\[([^\]]*)\]+$/;

	// Create the addAnother jQuery plugin
	$.fn.addAnother = function(options) {

		// Keeps track of the current number of items. Ensures uniqueness of IDs
		var counters = {};

		// This is the selector used to call addAnother
		var itemSelector = $(this).selector;

		// This is the class name of the item to which addAnother was called
		var itemClass = itemSelector.substr(itemSelector.lastIndexOf('.')+1);

		// The class added to copies of the item
		var copyClass = 'copy-'+itemClass;

		// Take the options parameter and combine with default settings
		var settings = jQuery.extend({
			limit: 0,
			minimum: 1,
			excludeSelector: ".exclude-item",
			emptySelector: ".empty-item",
			clearInputs: true,
			animate: false,
			allowRemove: true,
			removeClass: 'remove-item',
			removeSelector: false,
			addLinkText: "Add Another",
			addLinkClass: 'add-another-'+itemClass,
			addLinkSelector: false,
			removeLinkText: "Remove",
			onFull: false,
			onNotFull: false,
			onRemove: false,
			explicitBracketNumbering: false
		}, options);
		
		// Make sure limit is an int
		settings.limit = parseInt(settings.limit);

		// Add Another Link
		if (settings.addLinkText) $(itemSelector + ':last').after('<div class="add-another"><a href="#" class="'+settings.addLinkClass+'">'+settings.addLinkText+'</a></div>');
		
		// Fix initial bracketed values of input names for array submittal
		if (settings.explicitBracketNumbering) {
			$(itemSelector).find('input, textarea, select').each(function(){
				var elementName = $(this).attr('name');
				if (regexDoubleBrackets.test(elementName)){
					elementName = elementName.replace(regexDoubleBrackets, '[0][$1]');
				} else if (regexSingleBrackets.test(elementName)){
					elementName = elementName.replace(regexSingleBrackets, '[0]');
				}
				$(this).attr('name', elementName);
			});
		}
		
		// TODO let user customize
		var addRemoveLink = function ($to) {
			$to.append('<a href="#" class="'+settings.removeClass+'">'+settings.removeLinkText+'</a>');
		};
		
		// If more repeating sections are present than the minimum, give ’em remove links.
		if (settings.allowRemove) this.each(function(i,elem) {
			if (i >= settings.minimum || settings.minimum === 0) addRemoveLink($(elem));
		});
		
					
		// Add remove operation to removeClass click event
		if (settings.allowRemove && settings.removeClass) {
			$('.'+settings.removeClass+(settings.removeSelector ? ', '+settings.removeSelector : '')).live('click', function(){
				var $remove = $(this).parents(itemSelector);
				// Remove the copy of which the remove link was clicked
				if (settings.animate){ //todo allow speed to be set configurably
					$remove.hide('fast', function(){
						$remove.remove();
					});
				}else{
					$remove.remove();
				}
			
				// Call the onRemove callback if defined
				if (settings.onRemove){
					settings.onRemove();
				}
			});
		}
		
		
		// Set click action
		$('.'+settings.addLinkClass+(settings.addLinkSelector ? ', '+settings.addLinkSelector : '')).click(function(){
			
			// Stop at limit
			if (settings.limit != 0 && $(itemSelector).length >= settings.limit){
				return false;
			};

			// Increment the element counter
			if (!counters[itemSelector]){
				counters[itemSelector] = 1;
			}
			var counter = counters[itemSelector]++;
			
			// Get jQuery objects for all of the participating elements
			var master = $(itemSelector+":first");
			var parent = $(master).parent();
			var clone = $(master).clone(true)
				.addClass(copyClass+counter);

			// Add a remove link if enabled
			if (settings.allowRemove){
				if (counters[itemSelector] >= settings.minimum || settings.minimum === 0) {
					if ($(clone).children('.'+settings.removeClass+(settings.removeSelector ? ', '+settings.removeSelector : '')).length === 0) { addRemoveLink($(clone)) };
				}
			}
			
			// Remove elements with excludeSelector from the clone
			if (settings.excludeSelector){
				$(clone).find(settings.excludeSelector).remove();
			};
			
			// Empty elements with emptySelector in the clone
			if (settings.emptySelector){
				$(clone).find(settings.emptySelector).empty();
			};								
			
			// Increment clone IDs
			if ($(clone).attr('id') ){
				var newid = $(clone).attr('id')+'_'+counter;
				$(clone).attr('id', newid);
			};
			
			// Increment clone children IDs
			$(clone).find('[id]').each(function(){
				var newid = $(this).attr('id')+'_'+counter;
				$(this).attr('id', newid);
			});
			
			// Increment clone children labels
			$(clone).find('[for]').each(function(){
				var newfor = $(this).attr('for')+'_'+counter;
				$(this).attr('for', newfor);
			});
			
			// Fix bracketed values of input names for array submittal
			if (settings.explicitBracketNumbering) {
				$(clone).find('input, textarea, select').each(function(){
					var elementName = $(this).attr('name');
					if (regexDoubleBrackets.test(elementName)){
						elementName = elementName.replace(regexDoubleBrackets, '['+counter+'][$1]');
					} else if (regexSingleBrackets.test(elementName)){
						elementName = elementName.replace(regexSingleBrackets, '['+counter+']');
					}
					$(this).attr('name', elementName);
				});
			}
			
			// Clear Inputs/Textarea
			if (settings.clearInputs){
				$(clone).find(':input').each(function(){
					switch ($(this).attr('type'))
					{
						case "button":
						case "reset":
						case "submit":
							break;
						case "checkbox":
						case "radio":
							$(this).attr('checked', '');
							break;
						default:
						  $(this).val("");
					}
				});
			};
			
			// Hide new item by default if going to animate
			if (settings.animate){
				$(clone).css('display', 'none');
			}
			
			// Append the new element(s)
			$(parent).find(itemSelector+':last').after(clone);
			
			// Show it with animation
			if (settings.animate){
				$(clone).show('fast');
			}
			
			// Run onFull/onNotFull callbacks if defined
			if (settings.limit != 0 && $(itemSelector).length >= settings.limit){
				if (settings.onFull){
					settings.onFull();
				}
			}else{
				if (settings.onNotFull){
					settings.onNotFull();
				}
			}
			
			return false;
			
		}); // End click action
		
		
		return this; // Return to jQuery
	};
	
})(jQuery);