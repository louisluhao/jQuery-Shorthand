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
		
		/**
		 *	Regular Expression to grab the function name from a jQuery chain binding command.
		 */
		RX_FUNCTION = /^[a-zA-Z_]+/,
		
		/**
		 *	Regular Expression to separate scoping commands from event bindings.
		 */
		RX_SCOPE = /::/,
		
		/**
		 *	A list of attribute types to ignore when serializing an element.
		 */
		ATTRIBUTE_BLACKLIST = 
		[
			"class",
			
			"style",
			
			"id"
		],
		
		/**
		 *	The node type identifier for text nodes.
		 */
		TEXT_NODE = 3,
	
	//------------------------------
	//
	//	Property Declaration
	//
	//------------------------------
	
		/**
		 *	Capture the current value to handle overwriting.
		 */
		_$$ = window.$$,
		
		/**
		 *	The processor function for handling parsing.
		 */
		parseShorthand;
	
	//------------------------------
	//
	//	Internal Methods
	//
	//------------------------------
	
	//------------------------------
	//	 Utility Methods
	//------------------------------
	
	/**
	 *	Check the type of an object.
	 *
	 *	@param type		The item to check.
	 *
	 *	@param compare	The string to compare it to. Must be capitalized and of the proper type. (Object, Array, String, etc)
	 *
	 *	@return	True if the types match, false otherwise.
	 */
	function typecheck(type, compare)
	{
		return !type ? false : !type.constructor ? false : type.constructor.toString().match(new RegExp(compare + '\\(\\)', 'i')) !== null;	 
	}
	
	/**
	 *	Given a scoping chain, follow it down to the actual listener it references at the end of
	 *	the scope.
	 *
	 *	@param value	The scope chain value to extract a true function listener from.
	 *
	 *	@param strict	If true, and a valid listener could not be extracted from the scoping chain,
	 *					return false instead of a dead listener.
	 *
	 *	@return A function, (or boolean if strict is true) representing the listener. In the case a
	 *			listener could not be extracted from the scoping chain, and strict is false, a noop
	 *			function will be returned.
	 */
	function evaluate(value, strict)
	{
			/**
			 *	The scope chain being processed.
			 */
		var chain = window;
	
		/**
		 *	Walk the chain to find a valid handler.
		 */
		$.each(value.split(RX_SCOPE), function (index, scope)
		{
			if (!chain[scope])
			{
				return;
			}
			else
			{
				chain = chain[scope];
			}
		});
		
		return typecheck(chain, "Function") ? chain : (strict ? false : function () {});
	}
	
	/**
	 *	Process functional command declarations for the provided element.
	 *
	 *	@param element		The jQuery element to work against.
	 *
	 *	@param functional	The functional shorthand to process.
	 */
	function processFunctionalCommands(element, functional)
	{
		$.each(functional, function (command, args)
		{
			command = command.match(RX_FUNCTION)[0];
			
			/**
			 *	If the command doesn't exist, abort.
			 */
			if (!typecheck($.fn[command], "Function"))
			{
				return;
			}
			
			/**
			 *	Possible serialized function declaration.
			 */
			if (typecheck(args, "String"))
			{
				$.fn[command].call(element, evaluate(args));
			}
			
			/**
			 *	Literal function declaration.
			 */
			else if (typecheck(args, "Function"))
			{
				$.fn[command].call(element, args);
			}
		
			/**
			 *	Actual arguments to provide to the function.
			 */
			else if (typecheck(args, "Array"))
			{
				$.each(args, function (index, arg)
				{
					args[index] = evaluate(arg, true) || arg;
				});
				
				$.fn[command].apply(element, args);
			}
			
			/**
			 *	If the value is undefined, call the method without arguments.
			 */
			else if (args === undefined)
			{
				$.fn[command].call(element);
			}
			
			/**
			 *	Unable to process.
			 */
			else
			{
				return;
			}
		});
	}
	
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
	
	/**
	 *	Create a complex element.
	 *
	 *	@param elementShorthand	The element shorthand.
	 *
	 *	@param shorthand		The complex shorthand.
	 */
	function createComplexElement(elementShorthand, shorthand)
	{
			/**
			 *	Create an element from the shorthand at the front of the string.
			 */
		var element = createElement(elementShorthand),
			
			/**
			 *	Standard attributes to set.
			 */
			attributes,
			
			/**
			 *	Text to inject.
			 */
			text,
			
			/**
			 *	Children declarations.
			 */
			children;
			
		/**
		 *	Sort out the complex shorthand.
		 */
		$.each(shorthand, function (index, value)
		{
			/**
			 *	Object literals contain attribute declaration.
			 */
			if (typecheck(value, "Object"))
			{
				attributes = value;
			}
			
			/**
			 *	Arrays contain children elements.
			 */
			else if (typecheck(value, "Array"))
			{
				children = value;
			}
			
			/**
			 *	Strings contain element text.
			 */
			else if (typecheck(value, "String"))
			{
				text = value;
			}
		});
		
		/**
		 *	If an attribute block exists, check its contents for style and functional declarations.
		 */
		if (attributes !== undefined)
		{
			/**
			 *	Set style attributes.
			 */
			if (attributes._ !== undefined)
			{
				element.css(attributes._);
				delete attributes._;
			}
			
			/**
			 *	Extract functional attributes.
			 */
			if (attributes.$ !== undefined)
			{
				processFunctionalCommands(element, attributes.$);
				delete attributes.$;
			}
			
			/**
			 *	Set the element attributes.
			 */
			element.attr(attributes);
		}
		
		/**
		 *	If text is defined, set it in the element.
		 */
		if (text !== undefined)
		{
			element.html(decodeURIComponent(text));
		}
		
		/**
		 *	If children are defined, add them as well.
		 */
		if (children !== undefined)
		{
			$.each(parseShorthand.apply(parseShorthand, children), function (index, child)
			{
				element.append(child);
			});
		}
		
		return element;
	}
	
	/**
	 *	Create a document tree from a complex shorthand declaration.
	 *
	 *	@param tree	The shorthand tree to construct.
	 *
	 *	@return jQuery object wrapping the constructed siblings.
	 */
	function createSiblings(tree)
	{
		var elements = [];
		
		$.each(parseShorthand.apply(parseShorthand, tree), function (index, element)
		{
			elements.push(element[0]);
		});
	
		return $(elements);
	}
	
	/**
	 *	Create a group of elements with disperate configurations but the same tag.
	 *
	 *	@param tag			The tag type
	 *
	 *	@param definitions	The definitions for each instance to create in the group.
	 *
	 *	@return jQuery object wrapping the constructed group of elements.
	 */
	function createGroup(tag, definitions)
	{
			/**
			 *	The elements to create.
			 */
		var elements = [];
	
		/**
		 *	Create an element for each of the definitions provided.
		 */
		$.each(definitions, function (index, shorthand)
		{
			elements.push(createComplexElement(tag, shorthand)[0]);
		});
		
		return $(elements);
	}
	
	//------------------------------
	//	 Serialization
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
		var response = [],
		
			/**
			 *	A collection of attributes for the element.
			 */
			attributes = {},
			
			/**
			 *	The styles being applied to the element.
			 */
			styles = {},
			
			/**
			 *	The text.
			 */
			text,
			
			/**
			 *	The HTMLElement itself.
			 */
			html = element[0];
		
		/**
		 *	Create the attributes object.
		 */
		$.each(html.attributes, function (index, attribute)
		{
			/**
			 *	Filter out undesired attributes.
			 */
			if ($.inArray(attribute.name, ATTRIBUTE_BLACKLIST) !== -1)
			{
				return;
			}
			
			attributes[attribute.name] = attribute.value;
		});
		
		/**
		 *	Create the styles object.
		 */
		$.each(html.style, function (index, style)
		{
			styles[style] = element.css(style);
		});
		
		if (!$.isEmptyObject(styles))
		{
			attributes._ = styles;
		}
		
		$.each(html.childNodes, function (index, child)
		{
			if (child.nodeType === TEXT_NODE)
			{
				if (text === undefined)
				{
					text = "";
				}
				
				text += encodeURIComponent(child.nodeValue);
			}
		});
		
		if (!$.isEmptyObject(attributes))
		{
			response.push(attributes);
		}
		
		if (text !== undefined)
		{
			response.push(text);
		}
	
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
	parseShorthand = function()
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
				//	If there is no content defined, break.
				if (shorthand.length === 0)
				{
					return;
				}
				
				/**
				 *	If the first element of the shorthand is an array, it is a sibling group, containing
				 *	elements which should be created together.
				 */
				else if ($.isArray(shorthand[0]))
				{
					elements.push(createSiblings(shorthand));
				}
				
				/**
				 *	If the element is a string, this is a complex shorthand declaration.
				 */
				else if (typeof shorthand[0] === "string")
				{
					if (shorthand[0].substr(0, 1) === "&")
					{
						elements.push(createGroup(shorthand.shift().substr(1), shorthand));
					}
					else
					{
						elements.push(createComplexElement(shorthand.shift(), shorthand));
					}
				}
				
				/**
				 *	If none of these conditions are met, we can't parse this.
				 */
				else
				{
					return;
				}
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

