(function() {
  // setup 2d canvas context 
  const canvas = document.getElementById('myCanvas');
  const ctx    = canvas.getContext('2d');

  const cWidth  = canvas.width;
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
    y: cHeight/2,           // y coords
    speed: 1.0              // player speed
  };
  
  // enemy entity
  class Enemy {
    constructor(lw, stroke, fill, w, h, x, y) {
      this.lw = lw;
      this.stroke = stroke;
      this.fill = fill;
      this.w = w;
      this.h = h;
      this.x = x;
      this.y = y;
    }
  }
  /************** CREATING ENEMY: **************/
  /* instantiating enemies could be its own function.
   * @params for constructor could be randomised.
   */ 
  function createEnemy() {
    let enemy = []; 
    for (let i=0; i<7; i++) 
      enemy[i] = new Enemy(2, 'black', 'red', 15, 50, Math.floor(Math.random()*(800 - 100))+100, -50);
    return enemy;
  }
  let enemies = createEnemy();
  console.log(enemies);
  
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
    for (let i=0; i<7; i++) {
      drawItem(enemies[i]);
      enemies[i].y+=1.0;    // currently only moves in 1 directions
    }
    
    if (player.y == cHeight || player.y == 0 || player.x == cWidth || player.x == 0) {
      console.log("hello world.");
    }

    drawItem(player);
    movePlayer();

    window.requestAnimationFrame(gameLoop);
  }

  /************** PLAYER MOVEMENT/KEYBOARD INPUTS: **************/
  // bool values to trigger direction
  let up    = false;
  let down  = false;
  let left  = false;
  let right = false;

  function movePlayer() {
    if (up) 
      player.y-=player.speed;
    if (down) 
      player.y+=player.speed;
    if (right) 
      player.x+=player.speed;
    if (left) 
      player.x-=player.speed;
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


  /************************************* 
   HELLLOOOOOOOO THIS IS A TESTTTTTTTT 
  **************************************/

})();