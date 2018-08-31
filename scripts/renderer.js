// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------

MyGame.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');
	
	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	//------------------------------------------------------------------
	//
	// Public method that allows the client code to clear the canvas.
	//
	//------------------------------------------------------------------
	function clear() {
		context.clear();
	}
	
	
	//------------------------------------------------------------------
	//
	// This is used to create a texture object that can be used by client
	// code for rendering.
	//
	//------------------------------------------------------------------
	function Texture(spec) {
		var that = {},
			ready = false,
			image = new Image();
			
		//
		// Load the image, set the ready flag once it is loaded so that
		// rendering can begin.
		image.onload = function() { 
			ready = true;
		};
		image.src = spec.image;
		
		that.updateRotation = function(angle) {
			spec.rotation += angle;
		};
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
		};
		
		that.moveLeft = function(elapsedTime) {
			spec.center.x -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveRight = function(elapsedTime) {
			spec.center.x += spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveUp = function(elapsedTime) {
			spec.center.y -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveDown = function(elapsedTime) {
			spec.center.y += spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveTo = function(center) {
			spec.center = center;
		};

		that.getX = function(center){
			return spec.center.x
		}

		that.getY = function(center){
			return spec.center.y
		}

		that.getScore = function(){
			return spec.points
		}

		that.moveAngle = function(elapsedTime){
			spec.center.x += Math.cos(spec.angle) * spec.moveRate * (elapsedTime / 1000);
			spec.center.y += Math.sin(spec.angle) * spec.moveRate * (elapsedTime / 1000);
		}

		that.updateAngle = function(angle){
			spec.angle = angle;
		}

		that.updateSpeed = function(speed){
			spec.moveRate = speed;
		}

		that.getAngle = function(){
			return spec.angle;
		}
		
		that.updateWidth = function(){
			spec.width = 75;
		}

		that.getColor = function(){
			return spec.color;
		}

		that.draw = function() {
			if (ready) {
				context.save();
				
				context.translate(spec.center.x, spec.center.y);
				context.rotate(spec.rotation);
				context.translate(-spec.center.x, -spec.center.y);
				
				context.drawImage(
					image, 
					spec.center.x - spec.width/2,
					spec.center.y - spec.height/2,
					spec.width, spec.height);
				
				context.restore();
			}
		};
		
		return that;
	}

	function drawImage(center, size, rotation, image) {
		context.save();
		context.translate(center.x, center.y);
		context.rotate(rotation);
		context.translate(-center.x, -center.y);

		context.drawImage(
			image,
			center.x - size / 2,
			center.y - size / 2,
			size, size);

		context.restore();
	}
	
	return {
		clear : clear,
		Texture : Texture,
		drawImage: drawImage
	};
}());
