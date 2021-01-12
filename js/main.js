(function() {
  // setup 2d canvas context 
  const canvas = document.getElementById('myCanvas');
  const ctx    = canvas.getContext('2d');

  const cWidth  = canvas.width;
  const cHeight = canvas.height;

  /* Objects Declaration: */
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

  // car object
  const car = {
    lw: 2,                  
    stroke: 'black',         
    fill: 'red',       
    w: 15,                 
    h: 50,                  
    x: cWidth/2,                  
    y: -50
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
  
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);   
    car.y+=1.0;

    drawItem(player);
    drawItem(car);
    movePlayer();

    window.requestAnimationFrame(gameLoop);
  }
  
  /* keyboard inputs: */
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

})();