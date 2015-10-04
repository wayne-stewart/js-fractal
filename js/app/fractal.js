

define(["app/complex", "app/fractal_julia", "app/fractal_mandelbrot", "app/fractal_glynn"], function(Complex) { 
	
	var Fractal = function(eventBus) { 
		
		var settings = null;
		var fractalImpl = null;
		var canvasRect = null;
		var graphRect = null;
		var canvasToGraph = null;
		
		var ScreenToCartesianTransform = function(screenRect, transformer){
			this.transform = function(x, y) {
				var p = { 
					x: x - screenRect.w / 2,
					y: -(y - screenRect.h / 2)
				};
				return transformer ? transformer.transform(p.x, p.y) : p;
			};
		};
		
		var ScaleTransform = function (scale, transformer) { 
			this.transform = function(x, y) { 
				var p = {
					x: x * scale,
					y: y * scale
				};
				return transformer ? transformer.transform(p.x, p.y) : p;
			};
		};
		
		var TranslateTransform = function(tx, ty, transformer) { 
			this.transform = function(x, y) { 
				var p = { 
					x: x + tx,
					y: y + ty
				};
				return transformer ? transformer.transform(p.x, p.y) : p;
			};
		};
		
		var RotateTransform = function(angle, transformer) { 
			this.transform = function(x, y) { 
				var p = { 
					x: x * Math.cos(angle) - y * Math.sin(angle), 
					y: y * Math.cos(angle) + x * Math.sin(angle)
				};
				return transformer ? transformer.transform(p.x, p.y) : p;
			};
		};
		
		var CanvasToGraphTransform = function(screenRect, graphRect) {
			
			//var d = new TranslateTransform(-0.54, 0)
			//var b = new RotateTransform(Math.PI / 2, d);
			//var a = new ScaleTransform(graphRect.w / screenRect.w / 6.5, b);
			//var c = new ScreenToCartesianTransform(screenRect, a);
			
			var a = new ScaleTransform(graphRect.w / screenRect.w);
			var b = new ScreenToCartesianTransform(screenRect, a);
			
			this.transform = function(x, y) { 
				return b.transform(x, y);
			}; 
		};
		
		var initGraph = function(selectionBox) { 
			canvasRect = eventBus.send("get:canvas:size");
			
			var graphHeight = 2;
			var graphWidth = graphHeight * canvasRect.w / canvasRect.h;
			var x = 0 - graphWidth / 2;
			var y = 0 - graphHeight / 2;
			graphRect = { x:x, y:y, w:graphWidth, h:graphHeight };
			
			canvasToGraph = new CanvasToGraphTransform(canvasRect, graphRect);
		};
		
		var render = function() { 
			fractalImpl.applySettings(settings);
			var imgData = eventBus.send("get:canvas:imgData");
			var max_iterations = settings.getIterations();
			var colorMap = settings.colorMap(max_iterations);

			for ( var y = 0; y < canvasRect.h; y++ ) {
				for ( var x = 0; x < canvasRect.w; x++ ) {
			
					var i = canvasRect.w * y + x;
					var v = 0;
					
					var gp = canvasToGraph.transform(x, y);
					
					v = fractalImpl.iterate(new Complex(gp.x,gp.y),max_iterations);
					
					var c = v == -1 ? { r:0, g:0, b:0 } : colorMap[Math.round(v)];
	
					i = i * 4;
					imgData.data[i+0] = c.r;
					imgData.data[i+1] = c.g;
					imgData.data[i+2] = c.b;
					imgData.data[i+3] = 255;
				}
			}
			
			eventBus.send("canvas:draw");
			
		};
		
		eventBus.listen("fractal:selected", function(model) { 
			settings = model;
			var FractalImpl = require("app/fractal_" + model.fractalType);
			fractalImpl = new FractalImpl();
		});
		
		eventBus.listen("fractal:render", function() { 
			initGraph();
			render();
		});
		
		eventBus.listen("canvas:selectionCreated", function(selectionBox) { 
			//initGraph(selectionBox);
			//render();
		});
		
	};
	
	return Fractal;
});



