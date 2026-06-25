(function () {
  var canvas, ctx, W, H, vertices, current, points, animId, batchSize;
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getColor() {
    return darkQuery.matches ? { dot: '#4ade80', bg: '#0a0a0a' } : { dot: '#16a34a', bg: '#fafafa' };
  }

  function init() {
    canvas = document.getElementById('sierpinski-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    window.addEventListener('resize', function () { resize(); restart(); });
    darkQuery.addEventListener('change', function () { restart(); });
    canvas.addEventListener('click', function () { resize(); restart(); });

    restart();
  }

  function resize() {
    var container = canvas.parentElement;
    var size = Math.min(container.clientWidth, 440);
    W = size;
    H = Math.round(size * (Math.sqrt(3) / 2));
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
  }

  function restart() {
    cancelAnimationFrame(animId);
    var colors = getColor();
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, W, H);

    var pad = 10;
    vertices = [
      { x: W / 2, y: pad },
      { x: pad, y: H - pad },
      { x: W - pad, y: H - pad }
    ];

    current = { x: Math.random() * W, y: Math.random() * H };
    points = 0;
    batchSize = 8;
    animate();
  }

  function animate() {
    var colors = getColor();
    var maxPoints = 30000;

    for (var i = 0; i < batchSize; i++) {
      var v = vertices[Math.floor(Math.random() * 3)];
      current = { x: (current.x + v.x) / 2, y: (current.y + v.y) / 2 };
      points++;

      var alpha = Math.min(0.9, 0.15 + (points / maxPoints) * 0.75);
      ctx.fillStyle = colors.dot;
      ctx.globalAlpha = alpha;
      ctx.fillRect(Math.round(current.x), Math.round(current.y), 1.5, 1.5);
    }
    ctx.globalAlpha = 1.0;

    if (points < maxPoints) {
      if (points > 500) batchSize = 20;
      if (points > 3000) batchSize = 50;
      animId = requestAnimationFrame(animate);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
