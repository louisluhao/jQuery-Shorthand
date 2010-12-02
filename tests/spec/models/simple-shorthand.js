/*!
 *	Unit Test - jQuery Shorthand - Simple Shorthand
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
	//  Custom Matchers
	//
	//------------------------------
	
	//------------------------------
	//
	//  Unit Tests
	//
	//------------------------------
	
	Screw.Unit(function ()
	{
		describe("simple shorthand", function ()
		{
			it("creates element from shorthand: div", function ()
			{					
				expect($$("div")).to(be_element_type, "div");
			});
			
			it("creates element with id from shorthand: div#test-id", function ()
			{
				expect($$("div#test-id")).to(have_id, "test-id");
			});
			
			it("creates element with classes from shorthand: div.test-class.other-class", function ()
			{
				expect($$("div.test-class.other-class")).to(have_classes, ["test-class", "other-class"]);
			});
			
			it("creates element with id and classes from shorthand: div.test-class#test-id.other-class", function ()
			{
				var element = $$("div.test-class#test-id.other-class");
			
				expect(element).to(have_classes, ["test-class", "other-class"]);
				expect(element).to(have_id, "test-id");
			});
		
			it("creates an empty jQuery object when provided with invalid shorthand: !*!", function ()
			{
				expect($$("!*!")).to(have_length, 0);
			});
			
		});
		
		describe("multiple shorthand declarations", function ()
		{
			it("creates two standard elements when provided two shorthand declarations: div ; a", function ()
			{
				var elements = $$("div", "a");
				
				expect(elements).to(have_length, 2);
				expect(elements[0]).to(be_element_type, "div");
				expect(elements[1]).to(be_element_type, "a");
			});
		});
	
	});
		
}(jQuery));
