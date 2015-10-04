
requirejs.config({
	baseUrl: "js",
	
	paths: {
		app: "app",
		lib: "lib",
		jquery: "lib/jquery.min"
	},
	
	shim: {
		"colpick": ["jquery"]
	}
});

requirejs(["jquery", "app/menu", "app/eventbus", "app/fractal", "app/canvas"], function($, Menu, EventBus, Fractal, Canvas) { 
	
	$(function() {
		
		var eventBus = new EventBus();
		
		var menu = new Menu(eventBus);
		
		var fractal = new Fractal(eventBus);
		
		var canvas = new Canvas(eventBus);
		
		menu.init("julia");
	});
});