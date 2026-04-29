import { useEffect, useRef } from 'react';

const RADIUS = 140;
const COUNT  = 180;

function makeDrop(w, h, atTop = false) {
  const baseVy = 5 + Math.random() * 6;
  return {
    x:      Math.random() * w,
    y:      atTop ? -(Math.random() * 200) : Math.random() * h,
    vx:     (Math.random() - 0.5) * 0.5,
    vy:     baseVy,
    baseVy,
    len:    11 + Math.random() * 18,
    alpha:  0.18 + Math.random() * 0.42,
  };
}

const HeroRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const mouse  = { x: -9999, y: -9999 };

    // Size canvas to its CSS size
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    let drops = Array.from({ length: COUNT }, () => makeDrop(canvas.width, canvas.height));

    // Track mouse globally but convert to canvas-local coords
    // Only activate when inside the canvas bounds
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      if (lx >= 0 && lx <= rect.width && ly >= 0 && ly <= rect.height) {
        mouse.x = lx;
        mouse.y = ly;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      resize();
      drops = drops.map(d => ({ ...d, x: Math.random() * canvas.width }));
    };
    window.addEventListener('resize', onResize);

    let rafId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drops.forEach(d => {
        // Dampen horizontal drift, recover natural fall speed
        d.vx *= 0.94;
        d.vy += (d.baseVy - d.vy) * 0.05;

        // Cursor repulsion
        const dx   = d.x - mouse.x;
        const dy   = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS && dist > 0) {
          const force = ((RADIUS - dist) / RADIUS) * 6;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force * 0.35;
        }

        d.x += d.vx;
        d.y += d.vy;

        // Wrap / reset
        if (d.y > canvas.height + 20) Object.assign(d, makeDrop(canvas.width, canvas.height, true));
        if (d.x < -5)                  d.x = canvas.width  + 5;
        if (d.x > canvas.width  + 5)   d.x = -5;

        // Draw raindrop — line trails in the direction of travel
        const angle = Math.atan2(d.vy, d.vx);
        const tx    = d.x - Math.cos(angle) * d.len;
        const ty    = d.y - Math.sin(angle) * d.len;

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = `rgba(52, 211, 153, ${d.alpha})`;
        ctx.lineWidth   = 1.2;
        ctx.lineCap     = 'round';
        ctx.stroke();
      });

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
};

export default HeroRain;
