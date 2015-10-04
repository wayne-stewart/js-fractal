
define(["jquery", "app/Color","app/complex"], function($, Color, Complex) {
	
	var SettingModel = function(fractalType) { 
		
		var getter = function(name) {
			var el = $("#" + name, "#li_" + fractalType);
			if (el.length == 1)
				return el.val();
			
			el = $("#" + name);
			return el.val();
		};
		
		this.fractalType = fractalType;
		
		this.getConstant = function() { 
			var constant = new Complex(getter("constant"));
			return constant;
		};
		
		this.getGlynnFactor = function() { 
			var factor = parseFloat(getter("factor"));
			if (isNaN(factor)) {
				throw "glynn factor needs to be a number";
			}
			return factor;
		};
		
		this.getIterations = function() { 
			var iterations = parseInt(getter("iterations"));
			if (isNaN(iterations)) {
				throw "iterations must be an integer";
			}
			return iterations;
		};
		
		this.colorMap = function(n) { 
			var map1 = Color.createLinearGradientList(n/2, 0x444499, 0xBBBBBB);
			var map2 = Color.createLinearGradientList(n/2, 0xBBBBBB, 0xFFFFFF);
			return map1.concat(map2);
			//var map1 = Color.createLinearGradientList(n/2, 0x0000FF, 0x00FF00);
			//var map2 = Color.createLinearGradientList(n/2, 0xFF0000, 0xFFFFFF);
			//return map1.concat(map2);
		};
	};
	
	return function(eventBus) { 
		
		$("a", "#fractalTypeMenu").click(function(e) { 
			
			var jqEl = $(this);
			var t = jqEl.attr("data-fractal-type");
			if (!jqEl.hasClass("selected")) {
				var model = new SettingModel(t);
				eventBus.send("fractal:selected", model);
			}

			$("a", "#fractalTypeMenu").removeClass("selected");
			jqEl.addClass("selected");
			
			$("li[id^=li]", "#fractalTypeSettings").hide();
			$("#li_" + t, "#fractalTypeSettings").show();
		});
		
		$("#fractalRender").click(function(e) {
			eventBus.send("fractal:render");
		});
		
		this.init = function(fractalType) { 
			this.select(fractalType);
			$("#mainmenu").removeClass("hidden");
		};
		
		this.select = function(fractalType) { 
			$("a[data-fractal-type=" + fractalType + "]").click();
		};
	};
	
}); 