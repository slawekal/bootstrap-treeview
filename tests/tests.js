/* global $, module, test, equal, ok */

;(function () {

	'use strict';

	function init(options, elementSelector) {
		if (!elementSelector) {
			elementSelector = '#treeview';
		}
		return $(elementSelector).treeview(options);
	}
	
	function api(method, args) {
		return $('#treeview').treeview(method, args);
	}

	function getOptions(el) {
		return el.data('plugin_treeview').options;
	}
	
	QUnit.testDone(function(details) {
		sessionStorage.clear();
	});

	var data = [
		{
			text: 'Parent 1',
			nodes: [
				{
					text: 'Child 1',
					nodes: [
						{
							text: 'Grandchild 1'
						},
						{
							text: 'Grandchild 2'
						}
					]
				},
				{
					text: 'Child 2'
				}
			]
		},
		{
			text: 'Parent 2'
		},
		{
			text: 'Parent 3'
		},
		{
			text: 'Parent 4'
		},
		{
			text: 'Parent 5'
		}
	];

	var json = '[' +
		'{' +
			'"text": "Parent 1",' +
			'"nodes": [' +
				'{' +
					'"text": "Child 1",' +
					'"nodes": [' +
						'{' +
							'"text": "Grandchild 1"' +
						'},' +
						'{' +
							'"text": "Grandchild 2"' +
						'}' +
					']' +
				'},' +
				'{' +
					'"text": "Child 2"' +
				'}' +
			']' +
		'},' +
		'{' +
			'"text": "Parent 2"' +
		'},' +
		'{' +
			'"text": "Parent 3"' +
		'},' +
		'{' +
			'"text": "Parent 4"' +
		'},' +
		'{' +
			'"text": "Parent 5"' +
		'}' +
	']';

	module('Options');

	test('Options setup', function () {
		// First test defaults option values
		var el = init(),
			options = getOptions(el);
		ok(options, 'Defaults created ok');
		equal(options.levels, 2, 'levels defaults ok');
		equal(options.expandIcon, 'glyphicon glyphicon-plus', 'expandIcon defaults ok');
		equal(options.collapseIcon, 'glyphicon glyphicon-minus', 'collapseIcon defaults ok');
		equal(options.emptyIcon, 'glyphicon', 'emptyIcon defaults ok');
		equal(options.nodeIcon, 'glyphicon glyphicon-stop', 'nodeIcon defaults ok');
		equal(options.color, undefined, 'color defaults ok');
		equal(options.backColor, undefined, 'backColor defaults ok');
		equal(options.borderColor, undefined, 'borderColor defaults ok');
		equal(options.onhoverColor, '#F5F5F5', 'onhoverColor defaults ok');
		equal(options.selectedColor, '#FFFFFF', 'selectedColor defaults ok');
		equal(options.selectedBackColor, '#428bca', 'selectedBackColor defaults ok');
		equal(options.enableLinks, false, 'enableLinks defaults ok');
		equal(options.highlightSelected, true, 'highlightSelected defaults ok');
		equal(options.alwaysSelected, false, 'alwaysSelected default ok');
		equal(options.showBorder, true, 'showBorder defaults ok');
		equal(options.showTags, false, 'showTags defatuls ok');
		equal(options.stateSave, false, 'stateSave defaults ok');
		equal(options.onNodeSelected, null, 'onNodeSelected default ok');

		// Then test user options are correctly set
		var opts = {
			levels: 99,
			expandIcon: 'glyphicon glyphicon-expand',
			collapseIcon: 'glyphicon glyphicon-collapse',
			emptyIcon: 'glyphicon',
			nodeIcon: 'glyphicon glyphicon-node',
			color: 'yellow',
			backColor: 'purple',
			borderColor: 'purple',
			onhoverColor: 'orange',
			selectedColor: 'yellow',
			selectedBackColor: 'darkorange',
			enableLinks: true,
			highlightSelected: false,
			alwaysSelected: true,
			showBorder: false,
			showTags: true,
			stateSave: true,
			onNodeSelected: function () {}
		};

		options = getOptions(init(opts));
		ok(options, 'User options created ok');
		equal(options.levels, 99, 'levels set ok');
		equal(options.expandIcon, 'glyphicon glyphicon-expand', 'expandIcon set ok');
		equal(options.collapseIcon, 'glyphicon glyphicon-collapse', 'collapseIcon set ok');
		equal(options.emptyIcon, 'glyphicon', 'emptyIcon set ok');
		equal(options.nodeIcon, 'glyphicon glyphicon-node', 'nodeIcon set ok');
		equal(options.color, 'yellow', 'color set ok');
		equal(options.backColor, 'purple', 'backColor set ok');
		equal(options.borderColor, 'purple', 'borderColor set ok');
		equal(options.onhoverColor, 'orange', 'onhoverColor set ok');
		equal(options.selectedColor, 'yellow', 'selectedColor set ok');
		equal(options.selectedBackColor, 'darkorange', 'selectedBackColor set ok');
		equal(options.enableLinks, true, 'enableLinks set ok');
		equal(options.highlightSelected, false, 'highlightSelected set ok');
		equal(options.alwaysSelected, true, 'alwaysSelected set ok');
		equal(options.showBorder, false, 'showBorder set ok');
		equal(options.showTags, true, 'showTags set ok');
		equal(options.stateSave, true, 'stateSave set ok');
		equal(typeof options.onNodeSelected, 'function', 'onNodeSelected set ok');
	});

	test('Links enabled', function () {

		init({enableLinks:true, data:data});
		ok($('.list-group-item:first').children('a').length, 'Links are enabled');
		
	});

	module('Data');

	test('Accepts JSON', function () {

		var el = init({levels:1,data:json});
		equal($(el.selector + ' ul li').length, 5, 'Correct number of root nodes');

	});

	module('Behaviour');

	test('Is chainable', function () {
		var el = init();
		ok(el.addClass('test'), 'Is chainable');
		equal(el.attr('class'), 'treeview test', 'Test class was added');
	});

	test('Correct initial levels shown', function () {

		var el = init({levels:1,data:data});
		equal($(el.selector + ' ul li').length, 5, 'Correctly display 5 root nodes when levels set to 1');

		el = init({levels:2,data:data});
		equal($(el.selector + ' ul li').length, 7, 'Correctly display 5 root and 2 child nodes when levels set to 2');

		el = init({levels:3,data:data});
		equal($(el.selector + ' ul li').length, 9, 'Correctly display 5 root, 2 children and 2 grand children nodes when levels set to 3');
	});

	test('Expanding a node', function () {

		init({levels:1,data:data});

		var nodeCount = $('.list-group-item').length;
		var el = $('.click-expand:first');
		el.trigger('click');
		ok(($('.list-group-item').length > nodeCount), 'Number of nodes are increased, so node must have expanded');
	});

	test('Collapsing a node', function () {

		init({levels:2,data:data});

		var nodeCount = $('.list-group-item').length;
		var el = $('.click-collapse:first');
		el.trigger('click');
		ok(($('.list-group-item').length < nodeCount), 'Number of nodes has decreased, so node must have collapsed');
	});

	test('Selecting a node', function () {

		var cbWorked, onWorked = false;
		init({
			data: data,
			onNodeSelected: function(/*event, date*/) {
				cbWorked = true;
			}
		})
		.on('nodeSelected', function(/*event, date*/) {
			onWorked = true;
		});

		var el = $('.list-group-item:first');
		el.trigger('click');
		el = $('.list-group-item:first');
		ok((el.attr('class').split(' ').indexOf('node-selected') !== -1), 'Node is correctly selected : class "node-selected" added');
		ok(($('.node-selected').length === 1), 'There is only one selected node');
		ok(cbWorked, 'onNodeSelected function was called');
		ok(onWorked, 'nodeSelected was fired');
	});

	test('Unselecting a node', function () {

		var cbWorked, onWorked = false;
		init({
			data: data,
			onNodeSelected: function(/*event, date*/) {
				cbWorked = true;
			}
		})
		.on('nodeSelected', function(/*event, date*/) {
			onWorked = true;
		});

		// First select a node
		var el = $('.list-group-item:first');
		el.trigger('click');

		// Then test unselect by simulating another click
		cbWorked = onWorked = false;
		el = $('.list-group-item:first');
		el.trigger('click');
		el = $('.list-group-item:first');
		ok((el.attr('class').split(' ').indexOf('node-selected') === -1), 'Node is correctly unselected : class "node-selected" removed');
		ok(($('.node-selected').length === 0), 'There are no selected nodes');
		ok(!cbWorked, 'onNodeSelected was not called');
		ok(!onWorked, 'nodeSelected was not fired');
	});

	test('Unselecting a node prevented when alwaysSelected flag turned on', function () {

		var cbWorked, onWorked = false;
		init({
			data: data,
			alwaysSelected: true,
			onNodeSelected: function(/*event, date*/) {
				cbWorked = true;
			}
		})
		.on('nodeSelected', function(/*event, date*/) {
			onWorked = true;
		});

		// First select a node
		var el = $('.list-group-item:first');
		el.trigger('click');

		// Then test unselect by simulating another click
		cbWorked = onWorked = false;
		el = $('.list-group-item:first');
		el.trigger('click');
		el = $('.list-group-item:first');
		ok((el.attr('class').split(' ').indexOf('node-selected') !== -1), 'Node correctly stays selected : class "node-selected" kept');
		ok(($('.node-selected').length === 1), 'There is only one selected node');
		ok(!cbWorked, 'onNodeSelected was not called');
		ok(!onWorked, 'nodeSelected was not fired');
	});

	test('A first node is selected on init when alwaysSelected flag turned on', function () {

		var cbWorked, onWorked = false;
		init({
			data: data,
			alwaysSelected: true,
			onNodeSelected: function(/*event, date*/) {
				cbWorked = true;
			}
		})
		.on('nodeSelected', function(/*event, date*/) {
			onWorked = true;
		});

		var el = $('.list-group-item:first');
		ok((el.attr('class').split(' ').indexOf('node-selected') !== -1), 'Node is correctly selected : class "node-selected" added');
		ok(($('.node-selected').length === 1), 'There is only one selected node');
		ok(cbWorked, 'onNodeSelected function was called');
		ok(!onWorked, 'nodeSelected was not fired');
	});

	test('A selected node loses and gains a highlight when using toggleHighlightSelected', function () {

		var cbWorked, onWorked = false;
		var tree = init({
			data: data,
			alwaysSelected: true
		});
		var options = getOptions(tree);

		var el = null;
		var nodeIsSelected = function() {
			el = $('.list-group-item:first');
			ok((el.attr('class').split(' ').indexOf('node-selected') !== -1), 'Node is correctly selected : class "node-selected" added');
		};
		var nodeIsHightlighted = function() {
			ok((el.css('background-color') !== "" && el.css('background-color') !== "rgba(0, 0, 0, 0)"), 'Node is correctly highlighted');
		};
		var nodeIsNotHightlighted = function() {
			ok((el.css('background-color') === "" || el.css('background-color') === "rgba(0, 0, 0, 0)"), 'Node is correctly not highlighted');
		};
		
		nodeIsSelected();
		nodeIsHightlighted();
		
		api("toggleHighlightSelected");
		nodeIsSelected();
		nodeIsNotHightlighted();
		
		api("toggleHighlightSelected");
		nodeIsSelected();
		nodeIsHightlighted();
		
		api("toggleHighlightSelected", true);
		nodeIsSelected();
		nodeIsHightlighted();
		
		api("toggleHighlightSelected", false);
		nodeIsSelected();
		nodeIsNotHightlighted();
	});
	
	test('When using state, a previously selected node is restored', function () {
		
		var clickNode = function() {
			var el = $('.list-group-item:first');
			el.trigger('click');
		};
		
		var nodeIsSelected = function() {
			var el = $('.list-group-item:first');
			ok((el.attr('class').split(' ').indexOf('node-selected') !== -1), 'Node is correctly selected');
		};
		
		var nodeIsNotSelected = function() {
			var el = $('.list-group-item:first');
			ok((el.attr('class').split(' ').indexOf('node-selected') === -1), 'Node is correctly not selected');
		};
		
		init({
			data: data
		});
		nodeIsNotSelected();
		clickNode();
		nodeIsSelected();
		
		init({
			data: data,
			saveState: true
		});
		nodeIsNotSelected();
		clickNode();
		nodeIsSelected();
		
		init({
			data: data,
			saveState: true
		});
		nodeIsSelected();
		
		init({
			data: data
		});
		nodeIsNotSelected();
	});
	
	test('When using state, an unselected node is not restored', function () {
		
		var clickNode = function() {
			var el = $('.list-group-item:first');
			el.trigger('click');
		};
		
		var nodeIsSelected = function() {
			var el = $('.list-group-item:first');
			ok((el.attr('class').split(' ').indexOf('node-selected') !== -1), 'Node is correctly selected');
		};
		
		var nodeIsNotSelected = function() {
			var el = $('.list-group-item:first');
			ok((el.attr('class').split(' ').indexOf('node-selected') === -1), 'Node is correctly not selected');
		};
		
		init({
			data: data,
			saveState: true
		});
		nodeIsNotSelected();
		clickNode();
		nodeIsSelected();
		clickNode();
		nodeIsNotSelected();
		
		init({
			data: data,
			saveState: true
		});
		nodeIsNotSelected();
	});
	
	test('When using state, state is separate per element', function () {
		
		var clickNode = function() {
			var el = $('.list-group-item:first');
			el.trigger('click');
		};
		
		var nodeIsSelected = function() {
			var el = $('.list-group-item:first');
			ok((el.attr('class').split(' ').indexOf('node-selected') !== -1), 'Node is correctly selected');
		};
		
		var nodeIsNotSelected = function(treeViewSelector) {
			var el = $(treeViewSelector).find('.list-group-item:first');
			ok((el.attr('class').split(' ').indexOf('node-selected') === -1), 'Node is correctly not selected');
		};
		
		init({
			data: data,
			saveState: true
		});
		nodeIsNotSelected('#treeview');
		clickNode();
		nodeIsSelected();
		
		init({
			data: data,
			saveState: true
		}, '#treeview2');
		nodeIsNotSelected('#treeview2');
	});
	
	test('Id of the element is required', function () {
		
		var exceptionMessage = null;
		try {
			init({
				data: data
			}, '.treeviewClass');
		}
		catch(ex) {
			exceptionMessage = ex;
		}
		
		equal(exceptionMessage, "Id of a target element is required", "Expected exception has not been thrown.");
	});

	test('Clicking a non-selectable, colllapsed node expands the node', function () {
		var testData = $.extend(true, {}, data);
		testData[0].selectable = false;

		var cbCalled, onCalled = false;
		init({
			levels: 1,
			data: testData,
			onNodeSelected: function(/*event, date*/) {
				cbCalled = true;
			}
		})
		.on('nodeSelected', function(/*event, date*/) {
			onCalled = true;
		});

		var nodeCount = $('.list-group-item').length;
		var el = $('.list-group-item:first');
		el.trigger('click');
		el = $('.list-group-item:first');
		ok(!el.hasClass('node-selected'), 'Node should not be selected');
		ok(!cbCalled, 'onNodeSelected function should not be called');
		ok(!onCalled, 'nodeSelected should not fire');
		ok(($('.list-group-item').length > nodeCount), 'Number of nodes are increased, so node must have expanded');
	});

	test('Clicking a non-selectable, expanded node collapses the node', function () {
		var testData = $.extend(true, {}, data);
		testData[0].selectable = false;

		var cbCalled, onCalled = false;
		init({
			levels: 2,
			data: testData,
			onNodeSelected: function(/*event, date*/) {
				cbCalled = true;
			}
		})
		.on('nodeSelected', function(/*event, date*/) {
			onCalled = true;
		});

		var nodeCount = $('.list-group-item').length;
		var el = $('.list-group-item:first');
		el.trigger('click');
		el = $('.list-group-item:first');
		ok(!el.hasClass('node-selected'), 'Node should not be selected');
		ok(!cbCalled, 'onNodeSelected function should not be called');
		ok(!onCalled, 'nodeSelected should not fire');
		ok(($('.list-group-item').length < nodeCount), 'Number of nodes has decreased, so node must have collapsed');
	});

}());