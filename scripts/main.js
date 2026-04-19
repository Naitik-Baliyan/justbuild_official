/**
 * JUST BUILD 2.0 - Cinematic Interaction Engine
 */

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// 1. SMOOTH SCROLLING & PROGRESS
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: isTouchDevice ? 1.0 : 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  const progressBar = document.querySelector('.scroll-progress');
  lenis.on('scroll', (e) => {
    const progress = (e.animatedScroll / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// 2. MAGNETIC INTERACTION
function initMagnetics() {
  if (isTouchDevice) return;
  const elements = document.querySelectorAll('.btn-executive, .nav-cta, .btn-ghost');
  elements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const bound = el.getBoundingClientRect();
      const x = e.clientX - bound.left - bound.width / 2;
      const y = e.clientY - bound.top - bound.height / 2;
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = `translate(0, 0)`;
    });
  });
}

// 3. IMAGE PARALLAX
function initImageParallax() {
  window.addEventListener('scroll', () => {
    const depth = 0.05;
    const move = window.scrollY * depth;
    const logo = document.getElementById('main-logo');
    if (logo) logo.style.transform = `translateY(${move}px)`;
  });
}

// 2. PARALLAX TILT EFFECT
function initTiltEffect() {
  const cards = document.querySelectorAll('.ex-card, .s-card, .value-node, .why-item');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const dx = x - xc;
      const dy = y - yc;
      card.style.transform = `perspective(1000px) rotateY(${dx / 20}deg) rotateX(${-dy / 20}deg) translateY(-15px) scale(1.02)`;
      
      // Update radial glow position
      const glow = card.querySelector('::before'); // Not accessible via JS directly
      // Instead, we can use a custom property for the radial gradient center
      card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)`;
    });
  });
}

// 3. NEURAL BACKGROUND
function initNeuralBackground() {
  const canvas = document.getElementById('neural-canvas-light');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.radius > 1.8 ? 'rgba(196, 181, 253, 0.6)' : 'rgba(59, 130, 246, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.update();
      p.draw();
      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.beginPath();
          const color = dist < 100 ? '196, 181, 253' : '59, 130, 246';
          ctx.strokeStyle = `rgba(${color}, ${0.5 * (1 - dist / 180)})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// 4. MOBILE MENU
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const close = document.querySelector('.menu-close');
  const links = document.querySelectorAll('.mobile-links li');
  links.forEach((li, i) => li.style.setProperty('--i', i + 1));
  
  toggle.addEventListener('click', () => menu.classList.add('active'));
  close.addEventListener('click', () => menu.classList.remove('active'));
  document.querySelectorAll('.mobile-links a').forEach(l => {
    l.addEventListener('click', () => menu.classList.remove('active'));
  });
}

// 5. TYPEWRITER & REVEAL
function initTypewriter() {
  const words = [
    { text: "Limits", color: "#3b82f6" },
    { text: "Boundaries", color: "#8b5cf6" },
    { text: "Fears", color: "#10b981" },
    { text: "Expectations", color: "#f59e0b" },
    { text: "Imagination", color: "#3b82f6" }
  ];
  let i = 0, j = 0, current = "", isDeleting = false;
  const target = document.getElementById('typewriter');
  if (!target) return;

  // Clear initial HTML text to prevent "pop"
  target.textContent = "";

  function type() {
    const full = words[i % words.length].text;
    const color = words[i % words.length].color;
    
    target.style.color = color;
    target.style.webkitTextFillColor = color;

    current = isDeleting ? full.substring(0, j--) : full.substring(0, j++);
    target.textContent = current;
    
    let speed = isDeleting ? 70 : 120; // Slightly faster typing for realism
    
    if (!isDeleting && current === full) {
      speed = 2500; // Pause at end
      isDeleting = true;
    } else if (isDeleting && current === "") {
      isDeleting = false;
      i++;
      speed = 200; // Shorter pause before next word starts typing
    }
    
    setTimeout(type, speed);
  }
  setTimeout(type, 100); // Start immediately
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

// 6. FAQ & NAV SCROLL
function initFaq() {
  document.querySelectorAll('.faq-node').forEach(node => {
    node.addEventListener('click', () => {
      node.classList.toggle('active');
    });
  });
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// INITIALIZE ALL
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initMagnetics();
  initImageParallax();
  initTiltEffect();
  initNeuralBackground();
  initTypewriter();
  initScrollReveal();
  initFaq();
});
