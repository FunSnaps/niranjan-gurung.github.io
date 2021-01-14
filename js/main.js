(function() {
  /************** setup 2d canvas context **************/
  const canvas = document.getElementById('myCanvas');
  const ctx    = canvas.getContext('2d');

  /************** GLOBAL VARIABLES: **************/
  const cWidth  = canvas.width;
  const cHeight = canvas.height;

  const numOfEnemies = 10;
  let running = true;       // game loop state

  // bools used for player movement
  let up    = false;
  let down  = false;
  let left  = false;
  let right = false;
  let score = 0;

  /************** Objects Declaration: **************/
  // player object
  const player = {
    lw: 2,                  // line weight
    stroke: 'black',        // line colour
    fill: 'blue',           // colour of fill style/fill
    w: 20,                  // width dimensions
    h: 20,                  // height dimensions
    x: 50,                  // x coords
    y: cHeight/2,           // y coords
    speed: 1.0              // player speed
  };
  
  // enemy entity
  class Enemy {
    constructor(lw, stroke, fill, w, h, x, y, y2) {
      this.lw = lw;
      this.stroke = stroke;
      this.fill = fill;
      this.w = w;
      this.h = h;
      this.x = x;
      this.y = y;
      this.y2 = y2;
    }
  }

  // /************** FUNCTIONS DECLARATIONS: **************/
  //random x and y coord generator
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

  //creating enemy arrays
  function createEnemy() {
    let enemy = []; 
    for (let i=0; i<=numOfEnemies; i++) 
      enemy[i] = new Enemy(2, 'black', 'red', 15, 50, xCoord(), downwards(), upwards());
    return enemy;
  }

  // creates 2 seperate instances of enemy arrays  
  let enemies1 = createEnemy();
  let enemies2 = createEnemy();
  
  // draws object onto canvas
  function drawItem(obj) {
    ctx.strokeStyle = obj.stroke;
    ctx.fillStyle = obj.fill;
    ctx.lineWidth = obj.lw;

    // creates rectangle with current fill style/colour.
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    // adds stroke to rectangle with current stroke
    ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
  }

  function loopEnemies() {
    for (let i = 0; i <= 4; i++) {
      drawItem(enemies1[i]);
      drawItem(enemies2[i]);

      if (enemies1[i].y < 600) {
        enemies1[i].y += 2;
      }
      else {
        enemies1[i].x = xCoord();
        enemies1[i].y = downwards();
      }
      if (enemies2[i].y > 0) {
        enemies2[i].y -= 2;
      }
      else {
        enemies2[i].x = xCoord();
        enemies2[i].y = upwards();
      }
    }
  }

  // draw everything onto canvas for gameloop
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawItem(player);
    loopEnemies();
  }

  /************** PLAYER MOVEMENT/KEYBOARD INPUTS: **************/
  function movePlayer() {
    if (up) 
      player.y-=player.speed;
    if (down) 
      player.y+=player.speed;
    if (right) 
      player.x+=player.speed;
    if (left) 
      player.x-=player.speed;

    // key press
    document.addEventListener('keydown', function (ev) {
      if (ev.key === "ArrowUp") 
        up = true;
      if (ev.key === "ArrowDown") 
        down = true;
      if (ev.key === "ArrowRight") 
        right = true;
      if (ev.key === "ArrowLeft")
        left = true;
    });
    
    // key release
    document.addEventListener('keyup', function (ev) {
      if (ev.key === "ArrowUp") 
        up = false;
      if (ev.key === "ArrowDown") 
        down = false;
      if (ev.key === "ArrowRight") 
        right = false;
      if (ev.key === "ArrowLeft") 
        left = false;
    });
  }

  function checkCollision() {
    let finished = false;
    
    // collision for walls
    if (player.y+player.h===cHeight || player.y===0 || player.x+player.w===cWidth || player.x===0) {
      finished=true;
      
      player.x = 50;
      player.y = cHeight/2;
      return finished;
    }
  }

  function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.font = '30px serif';
    ctx.fillText('Game Over! Press any key to play again!', 30, 50);
  }

  function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '50px Verdana';
    ctx.fillText('Score : ' + score, 600,90);
  }

  function clearScore(){
    score = "";
  }

  /************** MAIN GAME LOOP: **************/
  window.requestAnimationFrame(gameLoop);
  
  function gameLoop() {
    if (running) {
      draw();         // draw player + enemies
      movePlayer();
  
      if (checkCollision()) {
        gameOver();
        clearScore();
        running=false;
      }
      drawScore();
      window.requestAnimationFrame(gameLoop);
    }
  }
})();