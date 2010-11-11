/*!
 *	jQuery Shorthand v0.1.0
 *
 *	Copyright (c) 2010 Knewton
 *	Dual licensed under:
 *		MIT: http://www.opensource.org/licenses/mit-license.php
 *		GPLv3: http://www.opensource.org/licenses/gpl-3.0.html
 */

"use strict";

/*global KOI, Class, window, jQuery */

/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 50, indent: 4 */

(function ($) 
{	

	//------------------------------
	//
	//	Constants
	//
	//------------------------------
	
		/**
		 *	Regular Expression to pull all classes out of a tag definition.
		 */
	var RX_CLASSES = /\.[a-zA-Z_\-]+/g,
		
		/**
		 *	Regular Expression to pull the id field out of a tag definition.
		 */
		RX_ID = /#[a-zA-Z_\-]+/,
		
		/**
		 *	Regular Expression to pull the element type out of a tag definition.
		 */
		RX_ELEMENT = /^[a-zA-Z0-9]+/,
		
		/**
		 *	Regular Expression to clean periods out of classes.
		 */
		RX_CLEAN_CLASSES = /\./g,
	
	//------------------------------
	//
	//	Property Declaration
	//
	//------------------------------
	
		/**
		 *	Capture the current value to handle overwriting.
		 */
		_$$ = window.$$;
	
	//------------------------------
	//
	//	Internal Methods
	//
	//------------------------------
	
	//------------------------------
	//	 Element Creation
	//------------------------------
	
	/**
	 *	Create an element from a shorthand declaration.
	 *
	 *	@param shorthand	The shorthand of the element to construct.
	 *
	 *	@return jQuery object wrapping the constructed HTML element.
	 */
	function createElement(shorthand)
	{
			/**
			 *	Extract the tag from the definition.
			 */
		var tag = shorthand.match(RX_ELEMENT),
		
			/**
			 *	Extract the ID from the definition.
			 */
			id = shorthand.match(RX_ID),
			
			/**
			 *	Extract the classes from the definition.
			 */
			classes = shorthand.match(RX_CLASSES),
			
			/**
			 *	The jQuery element.
			 */
			element;
	
		//	If the tag definition is null, return an empty object.
		if (tag === null)
		{
			return $();
		}
		
		/**
		 *	Create the element.
		 */
		element = $(document.createElement(tag[0]));
		
		/**
		 *	If any classes are defined, add them to the element.
		 */
		if (classes !== null)
		{
			element.addClass(classes.join(' ').replace(RX_CLEAN_CLASSES, ''))
		}
		
		/**
		 *	If an ID is defined, add it to the element.
		 */
		if (id !== null)
		{
			element.attr('id', id[0].substr(1));
		}
		
		return element;
	}
	
	//------------------------------
	//	Tree Creation
	//------------------------------
	
	/**
	 *	Create a document tree from a complex shorthand declaration.
	 *
	 *	@param tree	The shorthand tree to construct.
	 *
	 *	@return jQuery object wrapping the constructed HTML tree.
	 */
	function createTree(tree)
	{
	
	}
	
	//------------------------------
	//  Serialization
	//------------------------------
	
	/**
	 *	Serialize a full object. Returns all of the styles, attributes, etc. ascribed to the element.
	 *
	 *	@param element	The element to return a full serialization for.
	 */
	function serializeFullObject(element)
	{
			/**
			 *	The response data.
			 */
		var response = [];
		
		return response;
	}
	
	/**
	 *	Return a tree of shorthand representing the elements of a jQuery object.
	 *
	 *	@param elements		jQuery object containing the elements to output.
	 *
	 *	@param fullObject	If true, returns a full serialization of the object. Default is false.
	 *
	 *	@param fullTree		Recurse through the tree and build all contained children as elements.
	 *
	 *	@return An array of the serialized elements for each element in the jQuery object.
	 */
	function serialize(elements, fullObject, fullTree)
	{
			/**
			 *	The response data.
			 */
		var response = [];
		
		elements.each(function ()
		{
				/**
				 *	Grab a jQuery representation of the element.
				 */
			var element = $(this),
			
				/**
				 *	Create the shorthand declaration.
				 */
				shorthand = this.nodeName.toLowerCase(),
				
				/**
				 *	A response item for complex output.
				 */
				item;

			/**
			 *	If the element has an ID, add it to the shorthand.
			 */
			if (this.id.length > 0)
			{
				shorthand += "#" + this.id;
			}
			
			/**
			 *	The if the element has classes, add them to the shorthand.
			 */
			if (this.className.length > 0)
			{
				shorthand += "." + this.className.replace(' ', '.');
			}
			
			if (fullObject)
			{
				item = [shorthand];
				
				item = item.concat(serializeFullObject(element));
			}
		
			if (fullTree)
			{
				if (item === undefined)
				{
					item = [shorthand];
				}
				
				if (element.children().length > 0)
				{
					item.push(serialize(element.children(), fullObject, fullTree));
				}
			}
			
			if (item === undefined)
			{
				item = shorthand;
			}
			
			response.push(item);
		});
		
		return response;
	}
	
	//------------------------------
	//
	//	Plugin Definition
	//
	//------------------------------
	
	//------------------------------
	//	 Entry Point
	//------------------------------
	
	/**
	 *	The parser for shorthand.
	 *
	 *	@arguments	Accepts any number of String or Array arguments, representing any
	 *				combination of element and tree shorthand.
	 *
	 *	@return If only one argument is passed, will return only the jQuery object
	 *			representing the element. 
	 *
	 *			If multiple arguments are passed, the return will be an array of jQuery 
	 *			objects; ordered by their position in the arguments.
	 */
	function parseShorthand()
	{
			/**
			 *	The constructed elements to return.
			 */
		var elements = [];
		
		$.each(Array.prototype.slice.apply(arguments), function (index, shorthand)
		{
			if (typeof shorthand === "string")
			{
				elements.push(createElement(shorthand));
			}
			else if ($.isArray(shorthand))
			{
				elements.push(createTree(shorthand));
			}
		});
	
		return elements.length === 1 ? elements[0] : elements;
	}
	
	//------------------------------
	//	 Conflict Handler
	//------------------------------
	
	/**
	 *	Expose a noConflict method to remap then $$ object.
	 */
	parseShorthand.noConflict = function ()
	{
		window.$$ = _$$;
		
		return parseShorthand;
	};
	
	//------------------------------
	//	 Exporter
	//------------------------------
	
	/**
	 *	Return a tree of shorthand representing the elements of a jQuery object.
	 *
	 *	@param fullObject	If true, returns a full serialization of the object. Default is false.
	 *
	 *	@param fullTree		Recurse through the tree and build all contained children as elements.
	 *
	 *	@return If a single element is converted and is NOT a full object or full tree, the string
	 *			shorthand is returned.
	 *
	 *			If a group of elements are converted, the response will be an array where the index
	 *			of the shorthand item will correspond to the index in the jQuery object.
	 */
	$.fn.toShorthand = function (fullObject, fullTree)
	{
		var shorthand = serialize(this, fullObject, fullTree);
		
		return shorthand.length === 1 ? shorthand[0] : shorthand;
	};
	
	//------------------------------
	//
	//	Event Bindings
	//
	//------------------------------
	
	//------------------------------
	//
	//	Startup Code
	//
	//------------------------------
		
	//------------------------------
	//	 Expose to jQuery
	//------------------------------
		
	$.shorthand = parseShorthand;
	
	//------------------------------
	//	 Expose to window
	//------------------------------
		
	window.$$ = parseShorthand;
		
}(jQuery));

