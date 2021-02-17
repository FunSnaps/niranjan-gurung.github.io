(function () {
  /*****************************************************/
  /************** setup 2d canvas context **************/
  /*****************************************************/
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  /******************** SW register ********************/
  // if ('serviceWorker' in navigator) {
  //   window.addEventListener('load', () => {
  //     navigator.serviceWorker
  //       .register('/{https://niranjan-gurung.github.io}/sw_cached_pages.js', {scope: '/{https://niranjan-gurung.github.io}/'})
  //       .then(reg => console.log('Service Worker: Registered!'))
  //       .catch(err => console.log(`Service Worker: Error: ${err}`))
  //   })
  // }

  /************** GLOBAL VARIABLES: **************/
  const cWidth = canvas.width;
  const cHeight = canvas.height;

  const numOfEnemies = 5;
  let running = true;       // game loop state

  // bools used for player movement
  let up = false;
  let down = false;
  let left = false;
  let right = false;
  let enter = false;
  let score = 0;
  let gameFrame = 0; ///////////////////////////////////////////////////////////

  /**********************************************************/
  /************** Class Structure of Entities: **************/
  /**********************************************************/
  // base class
  const playerLeft = new Image();
  playerLeft.src = 'images/fish_Left1.ping';
  const playerRight = new Image();
  playerRight.src = 'images/fish1_Right.png';

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
      if (up) player.y -= player.speed;
      if (down) player.y += player.speed;
      if (right) player.x += player.speed;
      if (left) player.x -= player.speed;

      // key press
      document.addEventListener('keydown', function (ev) {
        if (ev.key === "ArrowUp") up = true;
        if (ev.key === "ArrowDown") down = true;
        if (ev.key === "ArrowRight") right = true;
        if (ev.key === "ArrowLeft") left = true;
        if (ev.key === "Enter") enter = true;
      });

      // key release
      document.addEventListener('keyup', function (ev) {
        if (ev.key === "ArrowUp") up = false;
        if (ev.key === "ArrowDown") down = false;
        if (ev.key === "ArrowRight") right = false;
        if (ev.key === "ArrowLeft") left = false;
        if (ev.key === "Enter") enter = false;
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
        enemy[i] = new Enemy(2, 'black', 'red', 15, 50, xCoord(), downwards(), upwards());
      return enemy;
    }
  }

  /******************************************************/
  /************** CREATE PLAYER + ENEMIES: **************/
  /******************************************************/
  const player = new Player(2, 'black', 'blue', 30, 30, 50, cHeight / 2, 1.0);
  let topEnemy = Enemy.createEnemy();
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
        /* reset top enemies when they reach the bottom.
        * smoothly transitions to re-enter from top of screen */
        topEnemy[i].y = -topEnemy[i].h;
        topEnemy[i].x = xCoord(); // calculate new x coordinate when it reaches end of screen.
      }
      if ((bottomEnemy[i].y + bottomEnemy[i].h) > 0)
        bottomEnemy[i].y -= 2;
      else {
        /* reset bottom enemies when they reach the top.
        * smoothly transitions to re-enter from bottom of screen */
        bottomEnemy[i].y = (bottomEnemy[i].y + bottomEnemy[i].h) + cHeight;
        bottomEnemy[i].x = xCoord(); // calculate new x coordinate when it reaches end of screen.
      }
    }
  }
  // draw everything onto canvas for gameloop
  function drawEntities() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bg.draw();
    player.draw();  // draw player
    //drawImage();
    loopEnemies();  // all enemies are drawn, positioned and smoothly looped when they reach the end of the screen.
  }

  /* Helper Functions:
   * random x coord generator */
  function xCoord() {
    var min = Math.ceil(100);
    var max = Math.floor(cWidth - 100);
    return Math.floor(Math.random() * (max - min) + min);
  }

  function downwards() {
    var min = Math.ceil(-600);
    var max = Math.floor(0);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function upwards() {
    var min = Math.ceil(500);
    var max = Math.floor(600);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /************** COLLISIONS: **************/
  function checkCollision() {
    let finished = false;

    // collision for walls
    if (player.y + player.h == cHeight || player.y == 0 || player.x + player.w == cWidth || player.x == 0) {
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
    ctx.fillStyle = "white";
    ctx.font = "35px Verdana";
    var gradient = ctx.createLinearGradient(0, 0, canvas.width,  0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    //fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillText('Game Over! Press enter to play again!', canvas.width / 6.5, canvas.height / 2);

    score += 10;
    playSound();
  }

  function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Verdana';
    ctx.fillText('Score : ' + score, 780, 30);
  }

  function clearScore() {
    score = "";
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
      handelBaubbles();
      gameFrame++;

      if (checkCollision()) {
        gameOver();
        running = false;
      }
      drawScore();
    }
    else if (enter) {
      clearScore();
      running = true;
    }
    window.requestAnimationFrame(gameLoop);
  }

  //Bubbles class
  const bubblesArray = [];
  class Bubble {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = 25;
      this.speed = Math.random() * 5 + 1;
      this.destance;
    }
    update1() {
      this.y -= this.speed;
    }

    draw1() {
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 4);
      ctx.fill();
      ctx.closePath();
      ctx.stroke();
    }
  }

  // Handel bubbles function  
  function handelBaubbles() {
    if (gameFrame % 50 == 0) {
      bubblesArray.push(new Bubble());
    }
    for (let i = 0; i < bubblesArray.length; i++) {
      bubblesArray[i].update1();
      bubblesArray[i].draw1();
    }
  }

  // Load sprite
  const sprite = new Image();
  sprite.src = "images/sprite4.jpg";
  //background
  const bg = {
    sX: 0,
    sY: 0,
    w: 420,
    h: 226,
    x: 0,
    y: canvas.height - 226,
    draw: function () {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y,
        this.w, this.h);

      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y,
        this.w, this.h);
    }
  }
})();