/*!
 *	Unit Test - jQuery Shorthand - Complex Shorthand
 *
 *	Copyright (c) 2010 Knewton
 *	Dual licensed under:
 *		MIT: http://www.opensource.org/licenses/mit-license.php
 *		GPLv3: http://www.opensource.org/licenses/gpl-3.0.html
 */

"use strict";

/*global window, jQuery, ScrewUnit */

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
		describe("complex shorthand", function ()
		{
			it("creates sibling elements from shorthand: [[div], [span], [a]]", function ()
			{			
				var elements = $$([['div'], ['span'], ['a']]);
				
				expect(elements).to(have_length, 3);
				expect(elements.eq(0)).to(be_element_type, "div");
				expect(elements.eq(1)).to(be_element_type, "span");
				expect(elements.eq(2)).to(be_element_type, "a");
			});
			
			it("creates multiple instances of the same type of element from shorthand: [&option, [{value: '1'}, 'Value 1'], [{value: '2'}, 'Value 2']]", function ()
			{
				var elements = $$(["&option", [{value: "1"}, "Value 1"], [{value: "2"}, "Value 2"]]);
				
				expect(elements).to(have_length, 2);
				expect(elements.eq(0)).to(be_element_type, "option");
				expect(elements.eq(0)).to(contain_text, "Value 1");
				expect(elements.eq(0).val()).to(equal, "1");
				expect(elements.eq(1)).to(be_element_type, "option");
				expect(elements.eq(1)).to(contain_text, "Value 2");
				expect(elements.eq(1).val()).to(equal, "2");
			});
			
		});
	
	});
		
}(jQuery));
