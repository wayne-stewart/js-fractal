
define(["app/complex"], function(Complex) { 
	
	var FractalImpl = function() { 
		
		var constant = new Complex(0, 0);
		
		var iterate = function(graphPoint, iterations) { 
			var i = 0;
			var m = 0;
			var z = constant.clone();
			var c = graphPoint;
			for (; i < iterations; i++) {
				m = z.modulus();
				if (m > 2) break;
				z.square().add(c);
			}
			return iterations == i ? -1 : i;
		};
		
		this.iterate = function(z, iterations) { 
			return iterate(z, iterations);
		};
		
		this.applySettings = function(settings) { 
			constant = settings.getConstant();
		};
	};
	
	return FractalImpl;
	
});



