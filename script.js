/* ============================================================
   VORTEX — Digital Futures
   script.js
   ============================================================ */

/* ── CUSTOM CURSOR ──────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');

let mx = 0, my = 0;   // mouse position
let tx = 0, ty = 0;   // trail position (lerped)

// Move the dot cursor instantly
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx - 6 + 'px';
  cursor.style.top  = my - 6 + 'px';
});

// Smoothly lag the trail ring behind the cursor
function animTrail() {
  tx += (mx - tx - 18) * 0.18;
  ty += (my - ty - 18) * 0.18;
  trail.style.left = tx + 'px';
  trail.style.top  = ty + 'px';
  requestAnimationFrame(animTrail);
}
animTrail();

// Scale cursor on interactive elements
document.querySelectorAll('a, button, .service-card, .work-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(2.5)';
    trail.style.transform  = 'scale(1.4)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    trail.style.transform  = 'scale(1)';
  });
});

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly for a cascade effect
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

reveals.forEach(el => revealObserver.observe(el));

/* ── PARALLAX ORBS ──────────────────────────────────────────── */
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  document.querySelectorAll('.orb').forEach((orb, i) => {
    const depth = (i + 1) * 12;
    orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
  });
});

/* ── ANIMATED STAT COUNTERS ─────────────────────────────────── */
/**
 * Counts up an element's text content from 0 to `target`
 * over ~60 frames, then appends an optional suffix.
 */
function animCount(el, target, suffix = '') {
  let current = 0;
  const increment = target / 60;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

// Trigger counters only when the stats bar enters the viewport
const statNums = document.querySelectorAll('.stat-num');

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animCount(statNums[0], 67, '+');
      animCount(statNums[1],  93, '%');
      animCount(statNums[2],  5);
      animCount(statNums[3],   1, '+');
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);
