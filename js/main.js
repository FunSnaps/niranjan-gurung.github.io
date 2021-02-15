(function() {
  /*****************************************************/
  /************** setup 2d canvas context **************/
  /*****************************************************/
  const canvas = document.getElementById('myCanvas');
  const ctx    = canvas.getContext('2d');

  /************** GLOBAL VARIABLES: **************/
  const cWidth  = canvas.width;
  const cHeight = canvas.height;

  const numOfEnemies = 5;

  // bools used for player movement
  let up    = false;
  let down  = false;
  let left  = false;
  let right = false;
  let enter = false;
  let score = 0;

  // game state
  let gameover = false;
  let running  = true;       

  /**********************************************************/
  /************** Class Structure of Entities: **************/
  /**********************************************************/
  // base class
  class Entity {
    constructor(lw, stroke, fill, w, h, x, y) {
      this.lw = lw;
      this.stroke = stroke;
      this.fill = fill;    
      this.w = w;
      this.h = h;
      this.x = x;
      this.y = y;
    }

    draw() {
      ctx.strokeStyle = this.stroke;
      ctx.fillStyle = this.fill;
      ctx.lineWidth = this.lw;

      // creates rectangle with current fill style/colour.
      ctx.fillRect(this.x, this.y, this.w, this.h);
      // adds stroke to rectangle with current stroke
      ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
  };

  // player object:
  class Player extends Entity {
    constructor(lw, stroke, fill, w, h, x, y, speed) {
      super(lw, stroke, fill, w, h, x, y);
      this.speed = speed;
    }

    /************** PLAYER MOVEMENT/KEYBOARD INPUTS: **************/
    movePlayer() {
      if (up)    player.y -= player.speed;
      if (down)  player.y += player.speed;
      if (right) player.x += player.speed;
      if (left)  player.x -= player.speed;
  
      // key press
      document.addEventListener('keydown', function (ev) {
        if (ev.key === "ArrowUp")    up    = true;        
        if (ev.key === "ArrowDown")  down  = true;
        if (ev.key === "ArrowRight") right = true;
        if (ev.key === "ArrowLeft")  left  = true;
        if (ev.key === "Enter")      enter = true;
      });
      
      // key release
      document.addEventListener('keyup', function (ev) {
        if (ev.key === "ArrowUp")    up    = false;
        if (ev.key === "ArrowDown")  down  = false;
        if (ev.key === "ArrowRight") right = false;
        if (ev.key === "ArrowLeft")  left  = false;
        if (ev.key === "Enter")      enter = false;
      });
    }
  };
  
  // enemy objects:
  class Enemy extends Entity {
    constructor(lw, stroke, fill, w, h, x, y, y2) {
      super(lw, stroke, fill, w, h, x, y)
      this.y2 = y2;
    }
    
    static createEnemy() {
      let enemy = []; 
      for (let i = 0; i < numOfEnemies; i++) 
        enemy.push(new Enemy(2, 'black', 'red', 15, 50, xCoord(), downwards(), upwards()));
      return enemy;
    }
  }

  /******************************************************/
  /************** CREATE PLAYER + ENEMIES: **************/
  /******************************************************/
  const player    = new Player(2, 'black', 'blue', 20, 20, 50, cHeight/2, 1.0);
  let topEnemy    = Enemy.createEnemy();
  let bottomEnemy = Enemy.createEnemy();

  /*****************************************************/
  /************** FUNCTIONS DECLARATIONS: **************/
  /*****************************************************/
  function loopEnemies() {
    for (let i = 0; i < numOfEnemies; i++) {
      topEnemy[i].draw();
      bottomEnemy[i].draw();

      if (topEnemy[i].y < cHeight) 
        topEnemy[i].y += 2;
      else {
       // calculate new x and y coordinates when it reaches bottom of screen.
       topEnemy[i].y = downwards();   
       topEnemy[i].x = xCoord();    
      }
      if ((bottomEnemy[i].y + bottomEnemy[i].h) > 0) 
        bottomEnemy[i].y -= 2;
      else {
       // calculate new x and y coordinates when it reaches top of screen.
       bottomEnemy[i].y = upwards();
       bottomEnemy[i].x = xCoord(); 
      }
    }
  }
  // draw everything onto canvas for gameloop
  function drawEntities() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw end of level area
    ctx.fillStyle = 'green';
    ctx.fillRect(cWidth-100, 0, cWidth-100, cHeight);

    player.draw();  // draw player
    loopEnemies();  // all enemies are drawn, positioned and smoothly looped when they reach the end of the screen.
  }

  /* Helper Functions:
   * random x coord generator */
  function xCoord() {
    var min = Math.ceil(120);
    var max = Math.floor(cWidth - 120);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function downwards() {
    var min = Math.ceil(-400);
    var max = Math.floor(0);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function upwards() {
    var min = Math.ceil(600);
    var max = Math.floor(1000);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /************** COLLISIONS: **************/
  function checkCollision() {
    // if you complete the level:
    if (player.x + player.w == (cWidth-100)) {
      score += 10;
      player.x = 50;
      player.y = cHeight/2;
    }

    // collision for walls
    if (player.y + player.h == cHeight || player.y == 0 || player.x == 0) {
      gameover = true;
      player.x = 50;
      player.y = cHeight/2;
      return gameover;
    }

    // collision for enemies
    for (let i = 0; i < numOfEnemies; i++) {
      if ((player.y < (topEnemy[i].y + topEnemy[i].h) && (player.y + player.h) > topEnemy[i].y) &&
          (player.x < (topEnemy[i].x + topEnemy[i].w) && (player.x + player.w) > topEnemy[i].x) || 
          (player.y < (bottomEnemy[i].y + bottomEnemy[i].h) && (player.y + player.h) > bottomEnemy[i].y) &&
          (player.x < (bottomEnemy[i].x + bottomEnemy[i].w) && (player.x + player.w) > bottomEnemy[i].x)) {
            gameover = true;
        player.x = 50;
        player.y = cHeight/2;
        return gameover;
      }
    }
  }

  function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.font = '40px serif';
    
    ctx.fillText(`GAME OVER. You scored ${score}`, 30, 50);
    ctx.fillText('Press Enter to Play Again', 30, 100);
    playSound();
  }

  function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Verdana';
    ctx.fillText('Score : ' + score, 780, 30);
  }

  function clearScore() {
    score = 0;
  }
  
  function playSound() {
    var sound = document.getElementById('sound');
    sound.play();
  }
  
  function playSound2() {
    var sound = document.getElementById('sound2');
    sound.play();
  }

  /************** MAIN GAME LOOP: **************/
  window.requestAnimationFrame(gameLoop);
  
  function gameLoop() {
    if (running) {
      drawEntities();         // draw player + enemies
      player.movePlayer();
      
      if (checkCollision()) {
        gameOver();
        running=false;
      }
      drawScore();
    } 
    else if (enter) {
      clearScore();
      running=true;
    }
    window.requestAnimationFrame(gameLoop);
  }
})();