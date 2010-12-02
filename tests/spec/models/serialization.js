/*!
 *	Unit Test - jQuery Shorthand - Serialization
 *
 *	Copyright (c) 2010 Knewton
 *	Dual licensed under:
 *		MIT: http://www.opensource.org/licenses/mit-license.php
 *		GPLv3: http://www.opensource.org/licenses/gpl-3.0.html
 */

"use strict";

/*global window, jQuery, Screw */

/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 50, indent: 4 */

(function ($) 
{
	//------------------------------
	//
	//  Internal Methods
	//
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
	 *	Compare an object against another object.
	 *
	 *	@param a	The first object.
	 *
	 *	@param b	The second object.
	 *
	 *	@return True if objects equal, false otherwise.
	 */
	function compareObject(a, b)
	{
		var equal = true;
	
		$.each(a, function (index, value)
		{
			if (typecheck(value, "Array") || typecheck(value, "Object"))
			{
				if (!compareObject(value, b[index]))
				{
					equal = false;
					return false;
				}
			}
			else
			{
				if (b[index] !== value)
				{
					equal = false;
					return false;
				}
			}
		});
		
		return equal;
	}

	//------------------------------
	//
	//  Custom Matchers
	//
	//------------------------------
	
	Screw.Matchers["equal_shorthand"] = 
	{
		match: function (expected, actual)
		{
			return compareObject(expected, actual);
		},
		
		failure_message: function (expected, actual, not)
		{
			return 'expected ' + $.print(actual) + (not ? ' to not equal ' : ' to equal ') + $.print(expected);
		}
	}
	
	//------------------------------
	//
	//  Unit Tests
	//
	//------------------------------
	
	Screw.Unit(function ()
	{
		describe("serialization", function ()
		{
			var element;
			
			before(function()
			{
				element = $("<div id='test' style='height: 200px; width: 100px;'><span class='test'><a href='http://a.com/'>Test</a><a href='http://b.com/'>Test 2</a></span></div>");
			});
			
			it("should serialize only the primary element as simple shorthand with no flags provided", function ()
			{
				expect(element.toShorthand()).to(equal, "div#test");
			});
			
			it("should serialize only the primary element as advanced shorthand with the fullObject flag provided", function ()
			{
				expect(element.toShorthand(true)).to(equal_shorthand, 
				[
					"div#test",
					
					{
						_:
						{
							height: "200px",
							
							width: "100px"
						}
					}
				]);
			});
			
			it("should serialize a tree of simple shorthand with the fullTree flag provided", function ()
			{
				var shorthand = element.toShorthand(false, true);
				
				expect(shorthand).to(equal, 
				[
					"div#test",
					
					[
						[
							"span.test", 
							
							[
								["a"],
								
								["a"]
							]
						]
					]
				]);
			});
			
			it("should serialize a tree of complex shorthand with the fullObject and fullTree flags provided", function ()
			{
				var shorthand = element.toShorthand(true, true);
				
				expect(shorthand).to(equal_shorthand, 
				[
					"div#test",
					
					{
						_:
						{
							height: "200px",
							
							width: "100px"
						}
					},
					
					[
						[
							"span.test", 
							
							[
								[
									"a",
									
									{
										href: "http://a.com/"
									},
									
									"Test"
								],
								
								[
									"a",
									
									{
										href: "http://b.com/"
									},
									
									encodeURIComponent("Test 2")
								]
							]
						]
					]
				]);
			});
			
		});
	
	});
		
}(jQuery));
