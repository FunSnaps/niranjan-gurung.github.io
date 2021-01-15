(function () {
  // setup 2d canvas context 
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  const cWidth = canvas.width;
  const cHeight = canvas.height;

  /************** Objects Declaration: **************/
  // player object
  const player = {
    lw: 2,                  // line weight
    stroke: 'black',        // line colour
    fill: 'blue',           // colour of fill style/fill
    w: 20,                  // width dimensions
    h: 20,                  // height dimensions
    x: 50,                  // x coords
    y: cHeight / 2,         // y coords
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
    for (let i = 0; i <= 4; i++)
      enemy[i] = new Enemy(2, 'black', 'red', 15, 50, xCoord(), downwards(), upwards());
    return enemy;
  }

  let enemies = createEnemy();
  let enemies2 = createEnemy();

  function loopEnemies() {

    for (let i = 0; i <= 4; i++) {
      drawItem(enemies[i]);
      drawItem(enemies2[i]);

      if (enemies[i].y < 600) {
        enemies[i].y += 2;
      }
      else {
        enemies[i].x = xCoord();
        enemies[i].y = downwards();
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

  window.requestAnimationFrame(gameLoop);

  /************** MAIN GAME LOOP: **************/
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw all enemy objects then move them

    loopEnemies();
    checkCollision();
    drawItem(player);
    movePlayer();

    window.requestAnimationFrame(gameLoop);
  }

  /************** PLAYER MOVEMENT/KEYBOARD INPUTS: **************/
  // bool values to trigger direction
  let up = false;
  let down = false;
  let left = false;
  let right = false;

  function movePlayer() {
    if (up)
      player.y -= player.speed;
    if (down)
      player.y += player.speed;
    if (right)
      player.x += player.speed;
    if (left)
      player.x -= player.speed;
  }

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

  function checkCollision() {
    let gameOver = false;

    if (player.y == cHeight || player.y == 0 || player.x == cWidth || player.x == 0) {
      gameOver = true;

      player.x = 0;
      player.y = 0;
      Enemy.x = 0;
      Enemy.y = 0;
      GameOver();
    }
    else if (player.x == Enemy.x || player.y == Enemy.y) {
      player.x = 0;
      player.y = 0;
      Enemy.x = 0;
      Enemy.y = 0;
      GameOver();
    }
    return gameOver;
  }

  function GameOver() {
    ctx.fillStyle = 'red';
    ctx.font = '50px serif';
    ctx.fillText('Game Over!', 50, 90);
  }

})();