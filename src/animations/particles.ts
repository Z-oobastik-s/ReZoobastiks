export function bootParticles(): void {
  const canvas = document.createElement("canvas");
  canvas.className = "fx-particles";
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  document.body.append(canvas);

  const points = Array.from({ length: 28 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: 1 + Math.random() * 2,
    speed: 0.0006 + Math.random() * 0.0015
  }));

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const point of points) {
      point.y -= point.speed;
      if (point.y < -0.04) point.y = 1.05;
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;
      ctx.fillStyle = "rgba(170,120,255,0.45)";
      ctx.beginPath();
      ctx.arc(x, y, point.size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  };
  tick();
}
