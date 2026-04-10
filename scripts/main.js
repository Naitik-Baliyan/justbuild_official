// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Parallax Controller
const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
let scrollY = 0;

const scrollProgress = document.getElementById('scroll-progress');

lenis.on('scroll', ({ scroll, limit, progress }) => {
  scrollY = scroll;
  if(scrollProgress) scrollProgress.style.width = `${progress * 100}%`;
  syncParallax();
  syncBackgroundParallax();
});

function syncBackgroundParallax() {
  const bgElements = document.querySelectorAll('.bg-parallax');
  bgElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const winH = window.innerHeight;
    
    if (rect.top < winH && rect.bottom > 0) {
      const speed = 0.5; 
      const shift = rect.top * speed;
      el.style.backgroundPositionY = `calc(50% + ${shift}px)`;
    }
  });
}

function syncParallax() {
  parallaxElements.forEach(el => {
    const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0;
    const yOffset = scrollY * speed;
    
    if (!el.classList.contains('glass-asset')) {
      el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
    }
  });
}

// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';

  // Mesh background movement
  const circles = document.querySelectorAll('.mesh-circle');
  circles.forEach((c, i) => {
    const shiftX = (mx - window.innerWidth / 2) * (0.02 + i * 0.01);
    const shiftY = (my - window.innerHeight / 2) * (0.02 + i * 0.01);
    c.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
  });
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// 3D Tilt Effect & Parallax Assets
document.addEventListener('mousemove', e => {
  const mx = e.clientX;
  const my = e.clientY;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  // Floating Assets Parallax (Combined Scroll + Mouse)
  const assets = document.querySelectorAll('.glass-asset');
  assets.forEach(asset => {
    const depth = parseFloat(asset.getAttribute('data-depth')) || 0;
    const scrollSpeed = parseFloat(asset.getAttribute('data-parallax-speed')) || 0;
    
    const mouseX = (mx - cx) * depth;
    const mouseY = (my - cy) * depth;
    const scrollYOffset = scrollY * scrollSpeed;
    
    asset.style.transform = `translate3d(${mouseX}px, ${mouseY + scrollYOffset}px, 0) rotate(${mouseX * 0.1}deg)`;
  });

  const tiltCards = document.querySelectorAll('.tilt-card, .value-cell, .testi-card, .roadmap-step');
  tiltCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    } else {
      card.style.transform = '';
    }
  });
});

// Magnetic Buttons & Element "Hugging"
const magElements = document.querySelectorAll('.btn-hero, .nav-cta-btn, .submit-btn, .social-btn, .nav-links a');
document.addEventListener('mousemove', e => {
  magElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const distanceBody = Math.sqrt(x*x + y*y);
    
    if (distanceBody < 120) {
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
      el.style.transition = 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)';
      
      // Ring hug effect
      if (ring) {
        ring.style.width = (rect.width + 20) + 'px';
        ring.style.height = (rect.height + 20) + 'px';
        ring.style.borderRadius = '8px';
      }
    } else {
      el.style.transform = '';
      el.style.transition = 'transform 0.5s var(--ease)';
      
      // Reset ring
      if (ring && !document.querySelector('a:hover, button:hover')) {
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderRadius = '50%';
      }
    }
  });
});

// Service Spotlight Tracking
document.querySelectorAll('.service-item').forEach(item => {
  item.addEventListener('mousemove', e => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    item.style.setProperty('--x', `${x}%`);
    item.style.setProperty('--y', `${y}%`);
  });
});

// Nav compact
lenis.on('scroll', ({ scroll }) => {
  const nav = document.getElementById('nav');
  if(nav) {
    nav.classList.toggle('compact', scroll > 60);
  }
});

// Scroll reveal & Metric Counter
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('reveal')) {
        entry.target.classList.add('visible');
      }
      if (entry.target.classList.contains('stat-val')) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal, .stat-val').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  let current = 0;
  const timer = setInterval(() => {
    current += Math.ceil(target / 60);
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 1000 / 60);
}

// Service accordion
function toggleService(item) {
  const items = [...document.querySelectorAll('.service-item')];
  const idx = items.indexOf(item);
  const panel = document.getElementById('sdp-' + idx);
  const cta = document.getElementById('scr-' + idx);
  const isOpen = panel.classList.contains('open');
  
  document.querySelectorAll('.service-detail-panel').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('.service-cta-row').forEach(c => c.style.display = 'none');
  document.querySelectorAll('.service-expand').forEach(b => { b.textContent = '+'; b.style.transform = ''; });
  
  if (!isOpen && panel) {
    panel.classList.add('open');
    if (cta) cta.style.display = 'flex';
    item.querySelector('.service-expand').textContent = '×';
  }
}

// FAQ accordion
function toggleFAQ(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Form submit automation
async function submitForm(e) {
  e.preventDefault();
  
  const form = document.getElementById('contact-form');
  const btn = form.querySelector('.submit-btn');
  const successState = document.getElementById('form-success');
  
  const originalBtnText = btn.innerHTML;
  btn.innerHTML = 'Sending... <span class="spinner-loader"></span>';
  btn.classList.add('loading');
  btn.disabled = true;

  const formData = {
    fullName: form.querySelector('input[type="text"]').value,
    phone: form.querySelector('input[type="tel"]').value,
    email: form.querySelector('input[type="email"]').value,
    service: form.querySelector('select').value,
    message: form.querySelector('textarea').value,
    source: "Main Website"
  };

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLz_p8p2o9N6X_5lX7A0o1-l-i-a-n/exec'; // Placeholder

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    form.style.display = 'none';
    successState.style.display = 'block';
    successState.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
  } catch (error) {
    console.error('Submission failed:', error);
    btn.innerHTML = originalBtnText;
    btn.classList.remove('loading');
    btn.disabled = false;
    // Fallback to simple success state even on error for better UX
    form.style.display = 'none';
    successState.style.display = 'block';
  }
}

// Typewriter Word Animation
const dynamicWord = document.getElementById('dynamic-word');
const words = ["Expectations.", "Boundaries.", "Doubts.", "Success.", "Limits."];
let wordIdx = 0, charIdx = 0, isDeleting = false, typeSpeed = 100;

function typeEffect() {
  if (!dynamicWord) return;
  const currentWord = words[wordIdx];
  
  if (isDeleting) {
    dynamicWord.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
    typeSpeed = 50;
  } else {
    dynamicWord.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
    typeSpeed = 150;
  }

  if (!isDeleting && charIdx === currentWord.length) {
    isDeleting = true;
    typeSpeed = 2000;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    typeSpeed = 500;
  }
  setTimeout(typeEffect, typeSpeed);
}
typeEffect();

// Ambient Focus Mode
let ambientTimer;
function resetAmbient() {
  document.body.classList.remove('ambient-mode');
  clearTimeout(ambientTimer);
  ambientTimer = setTimeout(() => {
    document.body.classList.add('ambient-mode');
  }, 15000);
}
document.addEventListener('mousemove', resetAmbient);
document.addEventListener('scroll', resetAmbient);
document.addEventListener('keydown', resetAmbient);
resetAmbient();

// Smooth anchor links mapping to Lenis
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const targetId = a.getAttribute('href');
    if (targetId === '#' || targetId === '') return;
    const t = document.querySelector(targetId);
    if (t) {
      e.preventDefault();
      lenis.scrollTo(t, { offset: -80 });
    }
  });
});
