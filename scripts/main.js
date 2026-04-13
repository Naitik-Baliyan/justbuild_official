/**
 * JUST BUILD 2.0 - Cinematic Interaction Engine
 */

// 1. SMOOTH SCROLLING (LENIS)
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// 2. CINEMATIC CURSOR SYSTEM
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  const follower = document.createElement('div');
  follower.id = 'cursor-follower';
  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    
    follower.animate({
      transform: `translate3d(${mouseX}px, ${mouseY}px, 0)`
    }, { duration: 500, fill: "forwards" });
  });

  const magnetics = document.querySelectorAll('.btn-executive, .nav-cta, .ex-card, .s-card, .value-node, .why-item');
  magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const bound = el.getBoundingClientRect();
      const x = e.clientX - bound.left - bound.width / 2;
      const y = e.clientY - bound.top - bound.height / 2;
      el.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = `translate3d(0, 0, 0) scale(1)`;
    });
  });

  const interactive = 'a, button, .ex-card, .s-card, .faq-node, input, textarea, select';
  document.querySelectorAll(interactive).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
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
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
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
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.8;
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

// 4. PRELOADER & MOBILE MENU
function initPreloader() {
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 1500);
  });
}

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
  const words = ["Potential", "Founders", "Success", "Digital World"];
  let i = 0, j = 0, current = "", isDeleting = false;
  const target = document.getElementById('typewriter');
  if (!target) return;

  function type() {
    const full = words[i % words.length];
    current = isDeleting ? full.substring(0, j--) : full.substring(0, j++);
    target.textContent = current;
    let speed = isDeleting ? 50 : 150;
    if (!isDeleting && current === full) { speed = 2000; isDeleting = true; }
    else if (isDeleting && current === "") { isDeleting = false; i++; speed = 500; }
    setTimeout(type, speed);
  }
  type();
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
  initPreloader();
  initMobileMenu();
  initSmoothScroll();
  initCustomCursor();
  initNeuralBackground();
  initTypewriter();
  initScrollReveal();
  initFaq();
});
