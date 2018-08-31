MyGame.screens['game-play'] = (function(game, graphics, input) {
	'use strict';
	
	var particleRenders = [];
	var bricks = [];
	var lives = [];
	var highScores = [];
	var canvas = document.getElementById("canvas-main");
	var ctx = canvas.getContext("2d");
	var myKeyboard = input.Keyboard(),
		hits = 0,
		countdown = 3000,
		brickWidth = 50,
		paddleWidth = 150,
		brickHeight = 15,
		extraLives = 2,
		loss = false,
		lostGame = false,
		paddle = null,
		yellowBrick = null,
		yellowBrick2 = null,
		orangeBrick = null,
		orangeBrick2 = null,
		blueBrick = null,
		blueBrick2 = null,
		greenBrick = null,
		greenBrick2 = null,
		ball = null,
		brick = null,
		one = null,
		two = null,
		three = null,
		life = null,
		cancelNextRequest = false,
		ps1 = null,
		ps2 = null,
		lastTimeStamp,
		score = 0;

	function newGame() {

		paddle = graphics.Texture( {
			image : 'images/grey.jpg',
			center : { x : 400, y : 520 },
			width : paddleWidth, height : brickHeight,
			moveRate : 800,			// pixels per second
		});
		
		ball = graphics.Texture( {
			image : 'images/ball.png',
			center : { x : 400, y : 505 },
			width : brickHeight, height : brickHeight,
			angle: - Math.PI/4 ,
			moveRate : 300,			// pixels per second
		});

		myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, paddle.moveLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, paddle.moveRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
			cancelNextRequest = true;
			game.showScreen('main-menu');
		});

		score = 0;
		lostGame = false;

		bricks = []
		lives = []
		for(var i = 0; i < extraLives; i++){
			life = graphics.Texture({
				image : 'images/heart.png',
				center : { x : 50 * i + 50 , y : 560 },
				width : 20, height : 20,
			})
			lives.push(life);
		}

		for(var i = 0; i < 16; i++){
			greenBrick = graphics.Texture( {
				image : 'images/green.jpg',
				center : { x : i * brickWidth + 25, y : 240},
				width : brickWidth - 5, height : brickHeight,
				points: 1,
				color: "green"
			})
			greenBrick2 = graphics.Texture( {
				image : 'images/green.jpg',
				center : { x : i * brickWidth + 25, y : 220 },
				width : brickWidth - 5, height : brickHeight,
				points: 1,
				color: "green2"
			})
			blueBrick = graphics.Texture( {
				image : 'images/blue.jpg',
				center : { x : i * brickWidth + 25, y : 200 },
				width : brickWidth - 5, height : brickHeight,
				points: 2,
				color: "blue"
			})
			blueBrick2 = graphics.Texture( {
				image : 'images/blue.jpg',
				center : { x : i * brickWidth + 25, y : 180 },
				width : brickWidth - 5, height : brickHeight,
				points: 2,
				color: "blue2"
			})
			orangeBrick = graphics.Texture( {
				image : 'images/orange.jpg',
				center : { x : i * brickWidth + 25, y : 160 },
				width : brickWidth - 5, height : brickHeight,
				points: 3,
				color: "orange"
			})
			orangeBrick2 = graphics.Texture( {
				image : 'images/orange.jpg',
				center : { x : i * brickWidth + 25, y : 140 },
				width : brickWidth - 5, height : brickHeight,
				points: 3,
				color: "orange2"
			})
			yellowBrick = graphics.Texture( {
				image : 'images/yellow.jpg',
				center : { x : i * brickWidth + 25, y : 120 },
				width : brickWidth - 5, height : brickHeight,
				points: 5,
				color: "yellow"
			})
			yellowBrick2 = graphics.Texture( {
				image : 'images/yellow.jpg',
				center : { x : i * brickWidth + 25, y : 100 },
				width : brickWidth - 5, height : brickHeight,
				points: 5,
				color: "yellow2"
			})
			bricks.push(yellowBrick)
			bricks.push(yellowBrick2)
			bricks.push(orangeBrick)
			bricks.push(orangeBrick2)
			bricks.push(blueBrick)
			bricks.push(blueBrick2)
			bricks.push(greenBrick)
			bricks.push(greenBrick2)
		}

		

	}
	function initialize() {
		console.log('game initializing...');
		score = 0;
		paddle = graphics.Texture( {
			image : 'images/grey.jpg',
			center : { x : 400, y : 520 },
			width : paddleWidth, height : brickHeight,
			moveRate : 800,			// pixels per second
		});
		
		ball = graphics.Texture( {
			image : 'images/ball.png',
			center : { x : 400, y : 500 },
			width : brickHeight, height : brickHeight,
			angle: - Math.PI/4 ,
			moveRate : 300,			// pixels per second
		});

		one = graphics.Texture({
			image : 'images/one.png',
			center : { x : 400, y : 300 },
			width : 200, height : 200,
		})

		two = graphics.Texture({
			image : 'images/two.png',
			center : { x : 400, y : 300 },
			width : 200, height : 200,
		})

		three = graphics.Texture({
			image : 'images/three.png',
			center : { x : 400, y : 300 },
			width : 200, height : 200,
		})

		for(var i = 0; i < extraLives; i++){
			life = graphics.Texture({
				image : 'images/heart.png',
				center : { x : 50 * i + 50 , y : 560 },
				width : 20, height : 20,
			})
			lives.push(life);
		}

		for(var i = 0; i < 16; i++){
			greenBrick = graphics.Texture( {
				image : 'images/green.jpg',
				center : { x : i * brickWidth + 25, y : 240},
				width : brickWidth - 5, height : brickHeight,
				points: 1
			})
			greenBrick2 = graphics.Texture( {
				image : 'images/green.jpg',
				center : { x : i * brickWidth + 25, y : 220 },
				width : brickWidth - 5, height : brickHeight,
				points: 1
			})
			blueBrick = graphics.Texture( {
				image : 'images/blue.jpg',
				center : { x : i * brickWidth + 25, y : 200 },
				width : brickWidth - 5, height : brickHeight,
				points: 2
			})
			blueBrick2 = graphics.Texture( {
				image : 'images/blue.jpg',
				center : { x : i * brickWidth + 25, y : 180 },
				width : brickWidth - 5, height : brickHeight,
				points: 2
			})
			orangeBrick = graphics.Texture( {
				image : 'images/orange.jpg',
				center : { x : i * brickWidth + 25, y : 160 },
				width : brickWidth - 5, height : brickHeight,
				points: 3
			})
			orangeBrick2 = graphics.Texture( {
				image : 'images/orange.jpg',
				center : { x : i * brickWidth + 25, y : 140 },
				width : brickWidth - 5, height : brickHeight,
				points: 3
			})
			yellowBrick = graphics.Texture( {
				image : 'images/yellow.jpg',
				center : { x : i * brickWidth + 25, y : 120 },
				width : brickWidth - 5, height : brickHeight,
				points: 5
			})
			yellowBrick2 = graphics.Texture( {
				image : 'images/yellow.jpg',
				center : { x : i * brickWidth + 25, y : 100 },
				width : brickWidth - 5, height : brickHeight,
				points: 5,
				color: "yellow2"
			})
			bricks.push(yellowBrick)
			bricks.push(yellowBrick2)
			bricks.push(orangeBrick)
			bricks.push(orangeBrick2)
			bricks.push(blueBrick)
			bricks.push(blueBrick2)
			bricks.push(greenBrick)
			bricks.push(greenBrick2)
		}

		//
		// Create the keyboard input handler and register the keyboard commands
		if(paddle.getX()-paddleWidth/2 > 0){
			myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, paddle.moveLeft);
		}
		
		myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, paddle.moveRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
			//
			// Stop the game loop by canceling the request for the next animation frame
			cancelNextRequest = true;
			//
			// Then, return to the main menu
			game.showScreen('main-menu');
		});
	}
	
	function collisionCheck(){
		for(var i = 0; i < bricks.length; i++){
			// hits left of brick
			if( 	ball.getX() + brickHeight/2 >= bricks[i].getX() - brickWidth/2 &
						ball.getX() + brickHeight/2 <= bricks[i].getX() + brickWidth/2 &
						ball.getY() >= bricks[i].getY() - brickHeight/2 &
						ball.getY() <= bricks[i].getY() + brickHeight/2 )
				{	
					var index = bricks.indexOf(bricks[i]);
					score += bricks[i].getScore()
					if(bricks[i].getColor() == 'yellow2'){
						paddle.updateWidth();
					}
					ps1 = ParticleSystem({
						position: { x: bricks[i].getX(), y: bricks[i].getY()},
						speed: { mean: 0.07, stdev: 0.025},
						lifetime: { mean: 500, stdev: 50 },
						size: { mean: 3, stdev: 1 },
						fill: 'rgba(0, 0, 255, 0.5)',
						image: 'images/fire.png',
						life: 500
					}, MyGame.graphics);
				
					ps2 = ParticleSystem({
						position: { x: bricks[i].getX(), y: bricks[i].getY()},
						speed: { mean: 0.02, stdev: 0.0125},
						lifetime: { mean: 500, stdev: 50 },
						size: { mean: 3, stdev: 1 },
						fill: 'rgba(255, 0, 0, 0.5)',
						image: 'images/smoke.png',
						life: 500
					}, MyGame.graphics);
					particleRenders.push(ps1);
					particleRenders.push(ps2);
					bricks.splice(index, 1)
					ball.updateAngle(ball.getAngle() * -1 + Math.PI);
					hits += 1;
					
			}
			//hits right of brick
			else if( 	ball.getX() - brickHeight/2 <= bricks[i].getX() + brickWidth/2 &
						ball.getX() - brickHeight/2 >= bricks[i].getX() - brickWidth/2 &
						ball.getY() >= bricks[i].getY() - brickHeight/2 &
						ball.getY() <= bricks[i].getY() + brickHeight/2 )
				{	
					var index = bricks.indexOf(bricks[i]);
					score += bricks[i].getScore()
					if(bricks[i].getColor() == 'yellow2'){
						paddle.updateWidth();
					}
					ps1 = ParticleSystem({
						position: { x: bricks[i].getX(), y: bricks[i].getY()},
						speed: { mean: 0.07, stdev: 0.025},
						lifetime: { mean: 500, stdev: 50 },
						size: { mean: 3, stdev: 1 },
						fill: 'rgba(0, 0, 255, 0.5)',
						image: 'images/fire.png',
						life: 500
					}, MyGame.graphics);
				
					ps2 = ParticleSystem({
						position: { x: bricks[i].getX(), y: bricks[i].getY()},
						speed: { mean: 0.02, stdev: 0.0125},
						lifetime: { mean: 500, stdev: 50 },
						size: { mean: 3, stdev: 1 },
						fill: 'rgba(255, 0, 0, 0.5)',
						image: 'images/smoke.png',
						life: 500
					}, MyGame.graphics);
					particleRenders.push(ps1);
					particleRenders.push(ps2);
					bricks.splice(index, 1)
					ball.updateAngle(ball.getAngle() * -1 - Math.PI);
					hits += 1;
					
			}
			//hits bottom of brick
			else if(	ball.getX() >= bricks[i].getX() - brickWidth/2 &
				ball.getX() <= bricks[i].getX() + brickWidth/2 &
				ball.getY() - brickHeight/2 >= bricks[i].getY() - brickHeight/2 &
				ball.getY() - brickHeight/2 <= bricks[i].getY() + brickHeight/2 )
				{
					var index = bricks.indexOf(bricks[i]);
					score += bricks[i].getScore()
					if(bricks[i].getColor() == 'yellow2'){
						paddle.updateWidth();
					}
					ps1 = ParticleSystem({
						position: { x: bricks[i].getX(), y: bricks[i].getY()},
						speed: { mean: 0.07, stdev: 0.025},
						lifetime: { mean: 500, stdev: 50 },
						size: { mean: 3, stdev: 1 },
						fill: 'rgba(0, 0, 255, 0.5)',
						image: 'images/fire.png',
						life: 500
					}, MyGame.graphics);
				
					ps2 = ParticleSystem({
						position: { x: bricks[i].getX(), y: bricks[i].getY()},
						speed: { mean: 0.02, stdev: 0.0125},
						lifetime: { mean: 500, stdev: 50 },
						size: { mean: 3, stdev: 1 },
						fill: 'rgba(255, 0, 0, 0.5)',
						image: 'images/smoke.png',
						life: 500
					}, MyGame.graphics);
					particleRenders.push(ps1);
					particleRenders.push(ps2);
					bricks.splice(index, 1)
					ball.updateAngle(-1 * ball.getAngle())
					hits += 1;
					
			}
			//hits top of brick
			else if( 	ball.getX() >= bricks[i].getX() - brickWidth/2 &
						ball.getX() <= bricks[i].getX() + brickWidth/2 &
						ball.getY() + brickHeight/2 >= bricks[i].getY() - brickHeight/2 &
						ball.getY() + brickHeight/2 <= bricks[i].getY() + brickHeight/2 )
				{	
					var index = bricks.indexOf(bricks[i]);
					score += bricks[i].getScore()
					if(bricks[i].getColor() == 'yellow2'){
						paddle.updateWidth();
					}
					ps1 = ParticleSystem({
						position: { x: bricks[i].getX(), y: bricks[i].getY()},
						speed: { mean: 0.07, stdev: 0.025},
						lifetime: { mean: 500, stdev: 50 },
						size: { mean: 3, stdev: 1 },
						fill: 'rgba(0, 0, 255, 0.5)',
						image: 'images/fire.png',
						life: 500
					}, MyGame.graphics);
				
					ps2 = ParticleSystem({
						position: { x: bricks[i].getX(), y: bricks[i].getY()},
						speed: { mean: 0.02, stdev: 0.0125},
						lifetime: { mean: 500, stdev: 50 },
						size: { mean: 3, stdev: 1 },
						fill: 'rgba(255, 0, 0, 0.5)',
						image: 'images/smoke.png',
						life: 500
					}, MyGame.graphics);
					particleRenders.push(ps1);
					particleRenders.push(ps2);
					bricks.splice(index, 1)
					ball.updateAngle(-1 * ball.getAngle())
					hits += 1;
					
			}
		}
		//hits paddle
		if( 	ball.getX() >= paddle.getX() - paddleWidth/2 &
					ball.getX() <= paddle.getX() + paddleWidth/2 &
					ball.getY() + brickHeight/2 >= paddle.getY() - brickHeight/2 &
					ball.getY() + brickHeight/2 <= paddle.getY() + brickHeight/2 )
			{	
				ball.updateAngle(((ball.getX()-paddle.getX()) / (paddleWidth/2)) - Math.PI/2)
		}
		// hits right wall
		else if(ball.getX() + brickHeight/2 >= 795){
			ball.updateAngle(ball.getAngle() * -1 + Math.PI);
		}
		// hits left wall
		else if(ball.getX() - brickHeight/2 <= 5){
			ball.updateAngle(ball.getAngle() * -1 - Math.PI);
		}
		//hits ceiling
		else if(ball.getY() - brickHeight/2 <= 5){
			ball.updateAngle(-1 * ball.getAngle());
		}
		//hits floor
		else if(ball.getY() + brickHeight/2 >= 600){
			loss = true;
			extraLives -= 1;
			if(extraLives >= 0){
				lives.pop()
				// paddle.center = {x: 400, y: 520};
				// ball.center = { x : 400, y : 505 };
				paddle = graphics.Texture( {
					image : 'images/grey.jpg',
					center : { x : 400, y : 520 },
					width : paddleWidth, height : brickHeight,
					moveRate : 800,			// pixels per second
				});
				
				ball = graphics.Texture( {
					image : 'images/ball.png',
					center : { x : 400, y : 505 },
					width : brickHeight, height : brickHeight,
					angle: - Math.PI/4 ,
					moveRate : 300,			// pixels per second
				});
				hits = 0;
				myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, paddle.moveLeft);
				myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, paddle.moveRight);
				myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
					cancelNextRequest = true;
					game.showScreen('main-menu');
				});
			}
			else{
				lostGame = true;
			}
		}
	}

	function update(elapsedTime) {
		for(var i = 0; i < particleRenders.length; i++){
			particleRenders[i].update(elapsedTime);
			particleRenders[i].setLife(elapsedTime)
			if(particleRenders[i].getLife() < 0){
				var index = particleRenders.indexOf(particleRenders[i]);
				particleRenders.splice(index, 1)
			}
		}
		myKeyboard.update(elapsedTime);
		if(countdown - elapsedTime > -1000){
			countdown -= elapsedTime;
		}
		if(countdown < 0){
			collisionCheck();
			ball.moveAngle(elapsedTime);
			if (loss == true){
				countdown = 3000;
				loss = false;
			}
			if (hits < 4 & hits >= 0){
				ball.updateSpeed(400)
			}
			else if (hits < 12 & hits >= 4){
				ball.updateSpeed(500)
			}
			else if (hits < 36 & hits >= 12){
				ball.updateSpeed(600)
			}
			else if (hits >= 36){
				ball.updateSpeed(700)
			}


		}
	}
	
	function render(elapsedTime) {
		graphics.clear();
		if(countdown < 4000 & countdown > 2000){
			three.draw();
		}
		else if(countdown < 2000 & countdown > 1000){
			two.draw();
		}
		else if(countdown < 1000 & countdown > 0){
			one.draw();
		}
		else{
			paddle.draw();
			ball.draw();
			for(var i = 0; i < bricks.length; i++){
				bricks[i].draw()
			}
			for(var i = 0; i < lives.length; i++){
				lives[i].draw()
			}
			ctx.font = "30px Comic Sans MS";
			ctx.fillStyle = "red";
			ctx.textAlign = "center";
			ctx.fillText("Score: " + score, canvas.width-100, canvas.height-50); 
			for(var i = 0; i < particleRenders.length; i++){
				particleRenders[i].render();
			}
		}	
	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		if(lostGame == true){
			highScores.push(score)
			var scores = document.getElementById("scores")
			var myScore = document.createElement("li");
			myScore.appendChild(document.createTextNode(score));
			scores.appendChild(myScore)
			game.showScreen('high-scores')
			alert("You lost! Your Score was: " + score + '. Click to play again!');
			game.showScreen('game-play')
			newGame();
		}

		if(bricks.length == 0){
			highScores.push(score)
			var scores = document.getElementById("scores")
			var myScore = document.createElement("li");
			myScore.appendChild(document.createTextNode(score));
			scores.appendChild(myScore)
			game.showScreen('high-scores')
			alert("You Won! Your Score was: " + score + '. Click to play again!');
			game.showScreen('game-play')
			newGame();
		}
		
		update(time - lastTimeStamp);
		lastTimeStamp = time;
		
		render(time);

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		lastTimeStamp = performance.now();
		//
		// Start the animation loop
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game, MyGame.graphics, MyGame.input));
