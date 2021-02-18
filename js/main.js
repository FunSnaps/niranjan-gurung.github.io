(function () {
  /*****************************************************/
  /************** setup 2d canvas context **************/
  /*****************************************************/
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  /************** GLOBAL VARIABLES: **************/
  const cWidth = canvas.width;
  const cHeight = canvas.height;

  // game loop state
  let running = true;       
  let finished = false;

  const numOfEnemies = 5;

  // bools used for player movement
  let up = false;
  let down = false;
  let left = false;
  let right = false;
  let enter = false;
  let r = false;
  let score = 0;

  /**********************************************************/
  /************** Class Structure of Entities: **************/
  /**********************************************************/
  // player object:
  class Player {
    constructor(w, h, x, y, frameX, frameY, speed, moving) {
      this.w = w;
      this.h = h;
      this.x = x;
      this.y = y;
      this.frameX = frameX;
      this.frameY = frameY;
      this.speed = speed;
      this.moving = moving;
    }

    draw(img, sX, sY, sW, sH, dX, dY, dW, dH) {
      ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
    }

    static createPlayer() {
      const player = new Player(32, 48, 50, cHeight/2, 0, 0, 1.0, false);
      return player;
    }

    /************** PLAYER MOVEMENT/KEYBOARD INPUTS: **************/
    movePlayer() {
      if (up) {
        player.y -= player.speed;
        player.frameY = 3;
        player.moving = true;
      }
      if (down) {
        player.y += player.speed;
        player.frameY = 0;
        player.moving = true;
      }
      if (right) {
        player.x += player.speed;
        player.frameY = 2;
        player.moving = true;
      }
      if (left) {
        player.x -= player.speed;
        player.frameY = 1;
        player.moving = true;
      }

      // key press
      document.addEventListener('keydown', function (ev) {
        if (ev.key === "ArrowUp") up = true;
        if (ev.key === "ArrowDown") down = true;
        if (ev.key === "ArrowRight") right = true;
        if (ev.key === "ArrowLeft") left = true;
        if (ev.key === "Enter") enter = true;
        if (ev.key === "r") r = true;
        player.moving = true;
      });

      // key release
      document.addEventListener('keyup', function (ev) {
        if (ev.key === "ArrowUp") up = false;
        if (ev.key === "ArrowDown") down = false;
        if (ev.key === "ArrowRight") right = false;
        if (ev.key === "ArrowLeft") left = false;
        if (ev.key === "Enter") enter = false;
        if (ev.key === "r") r = false;
        player.moving = false;
      });
    }

    handlePlayerFrame() {
      if (player.frameX < 3 && player.moving) player.frameX++;
      else player.frameX = 0;
    }
  };

  // enemy objects:
  class Enemy {
    constructor(w, h, x, y) {
      this.w = w;
      this.h = h;
      this.x = x;
      this.y = y;
    }

    draw(img, x, y, w, h) {
      ctx.drawImage(img, x, y, w, h);
    }

    static createEnemy(direction) {
      let enemy = [];
      for (let i = 0; i < numOfEnemies; i++)
        enemy[i] = new Enemy(10, 15, xCoord(), direction);
      return enemy;
    }
  }

  /******************************************************/
  /************** CREATE PLAYER + ENEMIES: **************/
  /******************************************************/
  // load sprites:
  const playerSprite = new Image();
  playerSprite.src = "images/starlord_mask.png";
  const background = new Image();
  background.src = "images/wallpaper1.jpg";
  let enemySprite = new Image();
  enemySprite.src = 'images/bgbattleship.png';

  // load audio:
  const ping = new Audio('sound/wallSound.wav'); 

  const player = Player.createPlayer();
  let topEnemy = Enemy.createEnemy(downwards());
  let bottomEnemy = Enemy.createEnemy(upwards());

  /*****************************************************/
  /************** FUNCTIONS DECLARATIONS: **************/
  /*****************************************************/
  function loopEnemies() {
    for (let i = 0; i < numOfEnemies; i++) {
      topEnemy[i].draw(
        enemySprite, topEnemy[i].x, topEnemy[i].y, 
        topEnemy[i].w*5, topEnemy[i].h*2.5);
      bottomEnemy[i].draw(
        enemySprite, bottomEnemy[i].x, bottomEnemy[i].y, 
        bottomEnemy[i].w*5, bottomEnemy[i].h*2.5);

      if (topEnemy[i].y < cHeight)
        topEnemy[i].y += 2;
      else {
        /* reset top enemies when they reach the bottom.
        * smoothly transitions to re-enter from top of screen */
        topEnemy[i].y = downwards();
        topEnemy[i].x = xCoord(); // calculate new x coordinate when it reaches end of screen.
      }
      if ((bottomEnemy[i].y + bottomEnemy[i].h) > 0)
        bottomEnemy[i].y -= 2;
      else {
        /* reset bottom enemies when they reach the top.
        * smoothly transitions to re-enter from bottom of screen */
        bottomEnemy[i].y = upwards();
        bottomEnemy[i].x = xCoord(); // calculate new x coordinate when it reaches end of screen.
      }
    }
  }
  // draw everything onto canvas for gameloop
  function drawEntities() {
    ctx.clearRect(0, 0, cWidth, cHeight);

    // load in background image: 
    ctx.drawImage(background, 0, 0, cWidth, cHeight);
    // player sprite load + animation:
    player.draw(
      playerSprite, player.w*player.frameX, player.h*player.frameY, 
      player.w, player.h, player.x, player.y, player.w, player.h);
    player.handlePlayerFrame();

    loopEnemies();  // all enemies are drawn, positioned and smoothly looped when they reach the end of the screen.
  }

  /* Helper Functions:
   * random x coord generator */
  function xCoord() {
    var min = Math.ceil(120);
    var max = Math.floor(cWidth - 120);
    return Math.floor(Math.random() * (max - min) + min);
  }

  function downwards() {
    var min = Math.ceil(-400);
    var max = Math.floor(0);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function upwards() {
    var min = Math.ceil(cHeight);
    var max = Math.floor(cHeight+400);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /************** COLLISIONS: **************/
  /* Helper functions for collision and game loop: */
  function isEndOfLevel() {
    if (player.x + player.w == cWidth) return true;
  }
  
  function levelComplete() {
    ctx.clearRect(0, 0, cWidth, cHeight);
    player.x = 50;
    player.y = cHeight / 2;
    score += 10;
    
    var gradient = ctx.createLinearGradient(0, 0, cWidth,  0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    //fill with gradient
    ctx.fillStyle = gradient;
    ctx.font = "30px Verdana";
    const text = "Level Completed!";
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (cWidth/2) - (textWidth/2), cHeight/2);
  }
  
  function checkCollision() {
    // collision for walls
    if (player.y + player.h == cHeight || player.y == 0 || player.x == 0) {
      finished = true;
      player.x = 50;
      player.y = cHeight / 2;
      return finished;
    }

    // collision for enemies
    for (let i = 0; i < numOfEnemies; i++) {
      if ((player.y < (topEnemy[i].y + topEnemy[i].h) && (player.y + player.h) > topEnemy[i].y) &&
        (player.x < (topEnemy[i].x + topEnemy[i].w) && (player.x + player.w) > topEnemy[i].x) ||
        (player.y < (bottomEnemy[i].y + bottomEnemy[i].h) && (player.y + player.h) > bottomEnemy[i].y) &&
        (player.x < (bottomEnemy[i].x + bottomEnemy[i].w) && (player.x + player.w) > bottomEnemy[i].x)) {
        finished = true;
        player.x = 50;
        player.y = cHeight / 2;
        return finished;
      }
    }
  }

  function gameOver() {
    ctx.clearRect(0, 0, cWidth, cHeight);
    var gradient = ctx.createLinearGradient(0, 0, cWidth,  0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    //fill with gradient
    ctx.fillStyle = gradient;
    ctx.font = "25px Verdana";
    const text = "Game Over! Your scored "+score+"! Press r to play again!";
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (cWidth/2) - (textWidth/2), cHeight/2);

    ping.play();
  }
  
  function drawScore() {
    var gradient = ctx.createLinearGradient(0, 0, cWidth,  0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    //fill with gradient
    ctx.font = "20px Verdana";
    ctx.fillStyle = gradient;
    ctx.fillText('Score : ' + score, 30, 40);
  }

  function clearScore() {
    score = 0;
  }

  /************** MAIN GAME LOOP: **************/
  function gameLoop() {
    if (running) {
      drawEntities();         // draw player + enemies
      player.movePlayer();
      //handelBaubbles();
      //gameFrame++;
      
      if (checkCollision()) {
        gameOver();
        running = false;
      }
      if (isEndOfLevel()) {
        levelComplete();
        running = false;
      }
      drawScore();
    }
    else if (enter) 
      running = true;

    else if (r) {
      clearScore();
      running = true;
    }
    window.requestAnimationFrame(gameLoop);
  }
  window.requestAnimationFrame(gameLoop);

  //Bubbles class
  // const bubblesArray = [];
  // class Bubble {
  //   constructor() {
  //     this.x = Math.random() * canvas.width;
  //     this.y = Math.random() * canvas.height;
  //     this.radius = 25;
  //     this.speed = Math.random() * 5 + 1;
  //     this.destance;
  //   }
  //   update1() {
  //     this.y -= this.speed;
  //   }

  //   draw1() {
  //     ctx.fillStyle = 'blue';
  //     ctx.beginPath();
  //     ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 4);
  //     ctx.fill();
  //     ctx.closePath();
  //     ctx.stroke();
  //   }
  // }

  // // Handel bubbles function  
  // function handelBaubbles() {
  //   if (gameFrame % 50 == 0) {
  //     bubblesArray.push(new Bubble());
  //   }
  //   for (let i = 0; i < bubblesArray.length; i++) {
  //     bubblesArray[i].update1();
  //     bubblesArray[i].draw1();
  //   }
  // }
})();