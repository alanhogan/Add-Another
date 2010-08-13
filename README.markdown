# AddAnother jQuery Plugin

A jQuery plugin for easily creating repeating HTML elements where the user can 
"Add another". This is especially good for repeating form input structures like
multiple file uploaders.

## Credits

**Author:** Jeremy Lindblom <<http://webdevilaz.com>>

**Contributor:** Alan Hogan <<http://alanhogan.com>>

**Note:** This is a fork of *relCopy* by Andres Vidal <<http://www.andresvidal.com/labs/relcopy.html>>

## Settings

- **limit** - The number of items that can exist in the group. 0 = unlimited
- **minimum** - The minimum number of items that can exist in the group. Default 1. 
	This affects the "remove" functionality only, and does not trigger auto-add on load.
- **excludeSelector** - Elements with this class will not be cloned
- **emptySelector** - Elements with this class will have subelements removed
- **clearInputs** - If true, then cloned input fields will have an empty value
- **animate** - If true, show/hide funcion are used with animation
- **allowRemove** - If true, then a remove link will be added automatically
- **removeClass** - The class of the remove link as a selector. (Should *not* begin with a period)
- **removeSelector** - If you are inserting your own remove links into the DOM, this selector
	lets you apply behavior to them.
- **addLinkText** - The <del>text</del> <ins>innerHTML</ins> of the add another link, or `false` to prevent the link from being added (use)
- **addLinkClass** - The class of the add another link. (Should *not* begin with a period.)
	(By default, `add-another-x` where `.x` appears in selector used to indicate what will be duplicated.)
- **addLinkSelector** - Adds the same behavior as the link created by `addLinkText`/`addLinkClass` to the element(s),
	if any, specified by this string.
	Note this is necessary if `addLinkText` is `false` then this does _not_ need to be a class; rather it
	can be any jQuery-supported selector, such as `"#foo .bar:last"`.
- **removeLinkText** - The text of the remove link
- **onFull** - A callback to be executed after an item is added and the group is full
- **onNotFull** - A callback to be executed after an item is added and the group is NOT full
- **onRemove** - A callback to be executed after an item is removed
- **explicitBracketNumbering** - Attempts to smartly set names that ended in    
	`[]` or `[0]` to end in    
	`[0]`, `[1]`, `[2]`…
	and names that ended in    
	`[0][foo]` to    
	`[0][foo]`, `[1][foo]`, `[2][foo]`…, respectively.    
	This is `false` by default, and it can cause problems if you repeat sections server-side as well
	in the current implementation.    
	(Don't worry, copied elements' `id` attributes and corresponding `for` attributes 
	are appended with `_1`, `_2`, … regardless.)

## Usage

In order to use AddAnother you must first include jQuery and the 
`addAnother.jquery.js` script in your page. Then create a chunk of HTML you 
would like to be able to replicate, and give it a class. Then add some javascript:

	$('.the-class-of-the-html-chunk').addAnother({...});
	
where "&hellip;" is the options. You can have more than one AddAnother on one
page. AddAnother does not automatically add brackets to your HTML names, so you
must do this yourself if you plan on using the posted data as an array. Take a 
look at the examples for more details.
