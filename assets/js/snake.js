(function () {
  var seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown'];
  var idx = 0;

  document.addEventListener('keydown', function (e) {
    if (document.getElementById('snake-overlay')) return;
    if (e.key === seq[idx]) { idx++; if (idx === seq.length) { idx = 0; launchSnake(); } }
    else { idx = 0; }
  });

  function launchSnake() {
    var CELL = 20, COLS = 20, ROWS = 20;
    var W = COLS * CELL, H = ROWS * CELL;

    var overlay = document.createElement('div');
    overlay.id = 'snake-overlay';
    Object.assign(overlay.style, {
      position:'fixed', top:0, left:0, width:'100%', height:'100%',
      background:'rgba(0,0,0,0.85)', zIndex:9999,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'
    });

    var header = document.createElement('div');
    Object.assign(header.style, { color:'#fff', fontFamily:'monospace', fontSize:'14px', marginBottom:'8px', textAlign:'center' });
    header.innerHTML = '<span id="snake-score" style="margin-right:20px">Score: 0</span><span style="opacity:0.5">ESC to close</span>';
    overlay.appendChild(header);

    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    Object.assign(canvas.style, { border:'2px solid #4ade80', borderRadius:'4px', background:'#0a0a0a' });
    overlay.appendChild(canvas);

    var msg = document.createElement('div');
    msg.id = 'snake-msg';
    Object.assign(msg.style, { color:'#4ade80', fontFamily:'monospace', fontSize:'18px', marginTop:'12px', height:'24px' });
    overlay.appendChild(msg);

    document.body.appendChild(overlay);
    canvas.focus();

    var ctx = canvas.getContext('2d');
    var snake, dir, nextDir, food, score, alive, interval;

    function reset() {
      snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
      dir = {x:1,y:0}; nextDir = {x:1,y:0};
      score = 0; alive = true;
      placeFood();
      document.getElementById('snake-msg').textContent = '';
      document.getElementById('snake-score').textContent = 'Score: 0';
    }

    function placeFood() {
      do { food = {x:Math.floor(Math.random()*COLS), y:Math.floor(Math.random()*ROWS)}; }
      while (snake.some(function(s){ return s.x===food.x && s.y===food.y; }));
    }

    function draw() {
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0,0,W,H);

      ctx.fillStyle = '#ef4444'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(food.x*CELL+CELL/2, food.y*CELL+CELL/2, CELL/2-2, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;

      snake.forEach(function(s, i) {
        var t = i / snake.length;
        var r = Math.round(74 + (34-74)*t);
        var g = Math.round(222 + (197-222)*t);
        var b = Math.round(128 + (94-128)*t);
        ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
        ctx.fillRect(s.x*CELL+1, s.y*CELL+1, CELL-2, CELL-2);
        if (i === 0) {
          ctx.fillStyle = '#0a0a0a';
          var ex1, ey1, ex2, ey2, es = 3;
          if (dir.x === 1)      { ex1=s.x*CELL+14; ey1=s.y*CELL+5;  ex2=s.x*CELL+14; ey2=s.y*CELL+13; }
          else if (dir.x===-1)  { ex1=s.x*CELL+5;  ey1=s.y*CELL+5;  ex2=s.x*CELL+5;  ey2=s.y*CELL+13; }
          else if (dir.y === 1) { ex1=s.x*CELL+5;  ey1=s.y*CELL+14; ex2=s.x*CELL+13; ey2=s.y*CELL+14; }
          else                  { ex1=s.x*CELL+5;  ey1=s.y*CELL+5;  ex2=s.x*CELL+13; ey2=s.y*CELL+5;  }
          ctx.fillRect(ex1-es/2, ey1-es/2, es, es);
          ctx.fillRect(ex2-es/2, ey2-es/2, es, es);
        }
      });
    }

    function tick() {
      if (!alive) return;
      dir = nextDir;
      var head = {x: snake[0].x+dir.x, y: snake[0].y+dir.y};

      if (head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||snake.some(function(s){return s.x===head.x&&s.y===head.y;})) {
        alive = false;
        document.getElementById('snake-msg').textContent = 'Game Over! Press SPACE to restart.';
        draw();
        return;
      }

      snake.unshift(head);
      if (head.x===food.x && head.y===food.y) {
        score++;
        document.getElementById('snake-score').textContent = 'Score: '+score;
        placeFood();
      } else {
        snake.pop();
      }
      draw();
    }

    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === ' ' && !alive) { reset(); return; }
      var map = {ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};
      var d = map[e.key];
      if (d && (d.x+dir.x!==0 || d.y+dir.y!==0)) { nextDir = d; }
      e.preventDefault();
    }

    function close() {
      clearInterval(interval);
      document.removeEventListener('keydown', onKey);
      overlay.remove();
    }

    document.addEventListener('keydown', onKey);
    reset(); draw();
    interval = setInterval(tick, 110);
  }
})();
