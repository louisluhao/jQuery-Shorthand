/*!
 *	Unit Test - jQuery Shorthand - Advanced Shorthand
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
		describe("advanced shorthand", function ()
		{
			it("creates element from advanced shorthand: [div#test-id.test-class]", function ()
			{
				var element = $$(["div#test-id.test-class"]);
				
				expect(element).to(be_element_type, "div");
				expect(element).to(have_id, "test-id");
				expect(element).to(have_classes, "test-class");
			});
			
			it("creates an empty jQuery object when provided invalid advanced shorthand: [{}, div#test-id]", function ()
			{
				expect($$([{}, "div#test-id"])).to(have_length, 0);
			});
			
			describe("text content", function ()
			{
				it("creates element containing text from advanced shorthand: [span, 'Test Content']", function ()
				{
					var element = $$(["span", "Test Content"]);
					
					expect(element).to(contain_text, "Test Content");
				});
				
				it("creates element containing last text from advanced shorthand: [span, 'Test Content', 'Not Content']", function ()
				{
					var element = $$(["span", "Test Content", "Not Content"]);
					
					expect(element).to_not(contain_text, "Test Content");
					expect(element).to(contain_text, "Not Content");
				});
			});
			
			describe("attributes, jQuery functions, and styles", function ()
			{
				describe("standard attributes", function ()
				{
					it("creates element with attributes from shorthand: [input, {type: 'text', value: 'Default Value'}]", function ()
					{
						var element = $$(["input", {type: "text", value: "Default Value"}]);
						
						expect(element.attr("type")).to(equal, "text");
						expect(element.val()).to(equal, "Default Value");
					});
					
					it("creates element using id from attributes as an override for shorthand: [div#test-div, {id: 'primary-div'}]", function ()
					{
						var element = $$(["div", {id: "primary-div"}]);
						
						expect(element).to(have_id, "primary-div");
					});
					
				});
				
				describe("style attributes", function ()
				{
					it("creates element with style attributes from shorthand: [div, {_: {borderWidth: 1}}]", function ()
					{
						var element = $$(["div", {_: {borderWidth: 1}}]);
						
						expect(element.css("borderWidth")).to(equal, "1px");
					});
					
					it("never creates element with underscore attribute from shorthand: [div, {_: {borderWidth: 1}}]", function ()
					{
						var element = $$(["div", {_: {borderWidth: 1}}]);

						expect(element.attr("_")).to(be_undefined);
					});
					
				});
				
				describe("jquery functions", function ()
				{
					before(function() 
					{
						$.fn.testShorthand = function (text)
						{
							return this.each(function ()
							{
								$(this).text(text === undefined ? "No Parameters Passed" : ($.isFunction(text) ? (text() || "Noop Function") : text));
							});
						};
						
						$.fn.noMethod = undefined;
						
						$.shorthandHandler = 
						{
							handler: function ()
							{
								return "Serialized Handler";
							}
						}
				    });
				
					it("creates element and invokes jQuery function with no parameters passed from shorthand: [div, {$: {testShorthand: [undefined]}}]", function ()
					{
						var element = $$(["div", {$: {testShorthand: [undefined]}}]);
						
						expect(element).to(contain_text, "No Parameters Passed");
					});
					
					it("never creates element with dollarsign attribute from shorthand: [div, {$: {testShorthand: [undefined]}}]", function ()
					{
						var element = $$(["div", {$: {testShorthand: [undefined]}}]);

						expect(element.attr("$")).to(be_undefined);
					});
					
					it("creates element and silently fails when attempting to invoke an undefined jQuery function from shorthand: [div, {$: {noMethod: undefined}}]", function ()
					{
						var element = $$(["div", {$: {noMethod: undefined}}]);
						
						expect(element).to(be_element_type, "div");
					});
					
					it("creates element and invokes jQuery function passing parameters from shorthand: [div, {$: {testShorthand: ['Some Text']}}]", function ()
					{
						var element = $$(["div", {$: {testShorthand: ['Some Text']}}]);
						
						expect(element).to(contain_text, "Some Text");
					});
					
					it("creates element and invokes jQuery function using noop function for invalid context string: [div, {$: {testShorthand: 'noMethod'}}]", function ()
					{
						var element = $$(["div", {$: {testShorthand: "noMethod"}}]);
						
						expect(element).to(contain_text, "Noop Function");
					});
					
					it("creates element and invokes jQuery function using actual function: [div, {$: {testShorthand: function (){ return 'Test'; }}}]", function ()
					{
						var element = $$(["div", {$: {testShorthand: function (){ return 'Test'; }}}]);
						
						expect(element).to(contain_text, "Test");
					});
					
				});
				
				describe("child elements", function ()
				{
					it("creates children elements from shorthand: [div, [[span, 'test']]", function ()
					{
						var element = $$(["div", [["span", "test"]]]);
					
						expect(element).to(be_element_type, "div");
						expect(element.children()).to(have_length, 1);
						expect(element.children().eq(0)).to(be_element_type, "span");
						expect(element.children().eq(0)).to(contain_text, "test");
					});
				});
				
			});
			
			
		});
		
	});
		
}(jQuery));
